import nock from "nock"
import request from "supertest"

import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
import Quiz from "../src/models/quiz"
import UserQuizState from "../src/models/user_quiz_state"
import { configA, safeClean, safeSeed } from "./util"

const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
const quizId = "11111111-0000-4000-8000-000000000001"
const openItemId = "11111111-0000-4000-8000-000000000011"
const multiItemId = "11111111-0000-4000-8000-000000000012"
const deletedItemId = "11111111-0000-4000-8000-000000000013"
const optionA = "11111111-0000-4000-8000-000000000101"
const optionB = "11111111-0000-4000-8000-000000000102"
const optionWrong = "11111111-0000-4000-8000-000000000103"
const deletedItemOption = "11111111-0000-4000-8000-000000000104"
const foreignItemId = "4a55eb54-6a9c-4245-843c-0577f3eafd9e"
const foreignOptionId = "2bdd0438-9c2f-4ede-81ff-a1cf55c647cd"

const peerReviewedQuizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
const reviewedAnswerId = "ae29c3be-b5b6-4901-8588-5b0e88774748"
const peerReviewCollectionId = "aeb6d4f1-a691-45e4-a900-2f7654a004cf"
const peerReviewQuestionId = "730e3083-7a0d-4ea7-9837-61ee93c6692f"
const peerReviewedChoiceItemId = "aeb6d4f1-a691-45e4-a900-2f7654a004cf"
const peerReviewedEssayItemId = "707195a3-aafe-4c06-bf23-854e54e084db"
const peerReviewedOptionId = "7c802f5b-52f1-468e-a798-3028edc1d3fd"
const otherQuizId = "2a0c2270-011e-40b2-8796-625764828034"
const essayQuestionId = "11111111-0000-4000-8000-000000000203"
const otherCollectionId = "11111111-0000-4000-8000-000000000201"
const otherQuestionId = "11111111-0000-4000-8000-000000000202"

let nextUserId = 900000

const newUser = async () => {
  const id = nextUserId++
  await knex("user").insert({ id })
  return id
}

const correctAnswer = () => ({
  quizId,
  itemAnswers: [
    { quizItemId: openItemId, textData: "koira", optionAnswers: [] },
    {
      quizItemId: multiItemId,
      textData: "",
      optionAnswers: [{ quizOptionId: optionA }, { quizOptionId: optionB }],
    },
  ],
})

const wrongAnswer = () => ({
  quizId,
  itemAnswers: [
    { quizItemId: openItemId, textData: "kissa", optionAnswers: [] },
    {
      quizItemId: multiItemId,
      textData: "",
      optionAnswers: [{ quizOptionId: optionWrong }],
    },
  ],
})

const submit = (userId: number, body: object) =>
  request(app.callback())
    .post("/api/v2/widget/answer")
    .set("Authorization", `bearer user-${userId}`)
    .set("Accept", "application/json")
    .send(body)

const fetchQuiz = (userId: number) =>
  request(app.callback())
    .get(`/api/v2/widget/quizzes/${quizId}`)
    .set("Authorization", `bearer user-${userId}`)

const openItemOf = (quiz: any) =>
  quiz.items.find((item: any) => item.id === openItemId)

const giveReview = (userId: number, body: object) =>
  request(app.callback())
    .post("/api/v2/widget/answers/give-review")
    .set("Authorization", `bearer user-${userId}`)
    .set("Accept", "application/json")
    .send(body)

/** Stores an attempt at the peer-reviewed quiz by `userId` and locks their quiz state, as a widget submission would. */
const answerPeerReviewedQuiz = async (
  userId: number,
  answer: { status?: string; deleted?: boolean } = {},
): Promise<string> => {
  const [{ id }] = await knex("quiz_answer")
    .insert({
      quiz_id: peerReviewedQuizId,
      user_id: userId,
      language_id: "xy_YZ",
      status: "submitted",
      ...answer,
    })
    .returning("id")
  const [{ id: choiceAnswerId }] = await knex("quiz_item_answer")
    .insert({ quiz_answer_id: id, quiz_item_id: peerReviewedChoiceItemId })
    .returning("id")
  await knex("quiz_option_answer").insert({
    quiz_item_answer_id: choiceAnswerId,
    quiz_option_id: peerReviewedOptionId,
  })
  await knex("quiz_item_answer").insert({
    quiz_answer_id: id,
    quiz_item_id: peerReviewedEssayItemId,
    text_data: "essay",
  })
  await knex("user_quiz_state")
    .insert({
      user_id: userId,
      quiz_id: peerReviewedQuizId,
      tries: 1,
      status: "locked",
    })
    .onConflict(["user_id", "quiz_id"])
    .ignore()
  return id
}

const peerReviewedQuizState = (userId: number) =>
  knex("user_quiz_state")
    .where({ user_id: userId, quiz_id: peerReviewedQuizId })
    .first()

/**
 * Sends `send` while another transaction holds `userId`'s lock on the peer-reviewed quiz and
 * raises their tries to 2, so a request that read their state without the lock writes back 1.
 */
const whileTriesChange = async (
  userId: number,
  send: () => request.Test,
): Promise<request.Response> => {
  const trx = await knex.transaction()
  let response: Promise<request.Response>
  try {
    await UserQuizState.lock(userId, peerReviewedQuizId, trx)
    await trx("user_quiz_state")
      .update({ tries: 2 })
      .where({ user_id: userId, quiz_id: peerReviewedQuizId })
    // `then` starts the request, which must reach the lock before it is released.
    response = send().then((sent) => sent)
    await new Promise((resolve) => setTimeout(resolve, 300))
    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error
  }
  return response
}

const setTries = (tries: number) =>
  knex("quiz").update({ tries }).where("id", quizId)

beforeAll(async () => {
  await safeSeed(configA)
  await knex("quiz").insert({
    id: quizId,
    course_id: courseId,
    part: 3,
    section: 1,
    points: 1,
    tries: 3,
    tries_limited: true,
  })
  await knex("quiz_translation").insert({
    quiz_id: quizId,
    language_id: "xy_YZ",
    title: "quiz",
    body: "body",
    submit_message: "nice one!",
  })
  await knex("quiz_item").insert([
    {
      id: openItemId,
      quiz_id: quizId,
      type: "open",
      order: 1,
      validity_regex: "koira",
      uses_shared_option_feedback_message: false,
    },
    {
      id: multiItemId,
      quiz_id: quizId,
      type: "multiple-choice",
      order: 2,
      multi: true,
      uses_shared_option_feedback_message: false,
    },
    {
      id: deletedItemId,
      quiz_id: quizId,
      type: "multiple-choice",
      order: 3,
      deleted: true,
      uses_shared_option_feedback_message: false,
    },
  ])
  await knex("quiz_item_translation").insert(
    [openItemId, multiItemId, deletedItemId].map((id) => ({
      quiz_item_id: id,
      language_id: "xy_YZ",
      title: "item",
      body: "item",
      success_message: "yay!",
      failure_message: "boo!",
    })),
  )
  await knex("quiz_option").insert([
    { id: optionA, quiz_item_id: multiItemId, order: 1, correct: true },
    { id: optionB, quiz_item_id: multiItemId, order: 2, correct: true },
    { id: optionWrong, quiz_item_id: multiItemId, order: 3, correct: false },
    {
      id: deletedItemOption,
      quiz_item_id: deletedItemId,
      order: 1,
      correct: true,
    },
  ])
  await knex("quiz_option_translation").insert(
    [optionA, optionB, optionWrong, deletedItemOption].map((id) => ({
      quiz_option_id: id,
      language_id: "xy_YZ",
      title: "option",
      success_message: "right",
      failure_message: "wrong",
    })),
  )
  await knex("peer_review_collection").insert({
    id: otherCollectionId,
    quiz_id: otherQuizId,
  })
  await knex("peer_review_question").insert({
    id: otherQuestionId,
    peer_review_collection_id: otherCollectionId,
    type: "grade",
    answer_required: true,
    default: false,
    order: 1,
  })
  await knex("peer_review_question").insert({
    id: essayQuestionId,
    peer_review_collection_id: peerReviewCollectionId,
    type: "essay",
    answer_required: true,
    default: false,
    order: 2,
  })
})

afterAll(async () => {
  nock.cleanAll()
  await safeClean()
  await redis.client?.quit()
  await knex.destroy()
})

beforeEach(() => {
  nock("https://tmc.mooc.fi")
    .persist()
    .get("/api/v8/users/current?show_user_fields=true")
    .reply(function () {
      const match = /^Bearer user-(\d+)$/.exec(
        String(this.req.headers.authorization),
      )
      return match ? [200, { id: Number(match[1]) }] : [401]
    })
})

afterEach(async () => {
  nock.cleanAll()
  await redis.client?.flushall()
  await knex("quiz").update({ tries: 3, points: 1 }).where("id", quizId)
  await knex("quiz_item")
    .update({ validity_regex: "koira" })
    .where("id", openItemId)
})

describe("widget answer submission", () => {
  test("rejects a submission without a quiz id", async () => {
    const userId = await newUser()
    const { quizId: _, ...answer } = correctAnswer()
    await submit(userId, answer).expect(400)
  })

  test("ignores nested relations and server-set fields", async () => {
    const userId = await newUser()
    const victimId = await newUser()
    const accompliceId = nextUserId++
    const response = await submit(userId, {
      ...correctAnswer(),
      status: "draft",
      correctnessCoefficient: 1,
      createdAt: "2000-01-01T00:00:00.000Z",
      user: {
        id: accompliceId,
        roles: [{ courseId, role: "teacher" }],
      },
      spamFlags: [{ userId: victimId }],
      userQuizState: {
        userId: victimId,
        quizId,
        tries: 0,
        status: "open",
        pointsAwarded: 1,
      },
    }).expect(200)

    const answerId = response.body.quizAnswer.id
    const stored = await knex("quiz_answer").where("id", answerId).first()
    expect(stored.user_id).toEqual(userId)
    expect(stored.status).toEqual("confirmed")
    expect(stored.correctness_coefficient).toEqual(0)
    expect(new Date(stored.created_at).getFullYear()).not.toEqual(2000)
    expect(
      await knex("user_course_role").whereIn("user_id", [userId, accompliceId]),
    ).toHaveLength(0)
    expect(
      await knex("spam_flag").where("quiz_answer_id", answerId),
    ).toHaveLength(0)
    expect(
      await knex("user_quiz_state").where("user_id", victimId),
    ).toHaveLength(0)
  })

  test("keeps the creation time of an earlier attempt when resubmitted", async () => {
    const userId = await newUser()
    const first = await submit(userId, wrongAnswer()).expect(200)
    const firstCreatedAt = first.body.quizAnswer.createdAt
    await new Promise((resolve) => setTimeout(resolve, 20))

    const second = await submit(userId, {
      ...first.body.quizAnswer,
      ...wrongAnswer(),
      deleted: false,
    }).expect(200)

    expect(second.body.quizAnswer.createdAt).toEqual(firstCreatedAt)
  })
})

describe("widget answer response", () => {
  test("hides the answer key while tries remain", async () => {
    const userId = await newUser()
    const response = await submit(userId, wrongAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("open")
    const items = response.body.quiz.items
    const openItem = openItemOf(response.body.quiz)
    const multiItem = items.find((item: any) => item.id === multiItemId)
    expect(openItem.validityRegex).toBeUndefined()
    expect(openItem.successMessage).toBeUndefined()
    for (const option of multiItem.options) {
      expect(option.correct).toBeUndefined()
    }
  })

  test("hides the answer key of a quiz worth no points while tries remain", async () => {
    await knex("quiz").update({ points: 0 }).where("id", quizId)
    const userId = await newUser()
    const response = await submit(userId, wrongAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("open")
    expect(openItemOf(response.body.quiz).validityRegex).toBeUndefined()
  })

  test("hides the answer key of a quiz worth no points when fetched", async () => {
    await knex("quiz").update({ points: 0 }).where("id", quizId)
    const userId = await newUser()
    await submit(userId, wrongAnswer()).expect(200)
    const fetched = await fetchQuiz(userId).expect(200)

    expect(openItemOf(fetched.body.quiz).validityRegex).toBeUndefined()
  })

  test("shows the answer key to a student with more than the quiz's points", async () => {
    await knex("quiz").update({ points: 2 }).where("id", quizId)
    const userId = await newUser()
    await submit(userId, correctAnswer()).expect(200)
    await knex("quiz").update({ points: 1 }).where("id", quizId)
    const fetched = await fetchQuiz(userId).expect(200)

    expect(openItemOf(fetched.body.quiz).validityRegex).toEqual("koira")
  })

  test("hides the answer key like the widget's quiz route does", async () => {
    const userId = await newUser()
    const submitted = await submit(userId, wrongAnswer()).expect(200)
    const fetched = await fetchQuiz(userId).expect(200)

    expect(submitted.body.quiz).toEqual(fetched.body.quiz)
  })

  test("is built without reading the quiz again", async () => {
    const getById = jest.spyOn(Quiz, "getById")
    try {
      const userId = await newUser()
      await submit(userId, wrongAnswer()).expect(200)
      expect(getById).toHaveBeenCalledTimes(1)
    } finally {
      getById.mockRestore()
    }
  })

  test("shows the answer key once the quiz is locked", async () => {
    await setTries(1)
    const userId = await newUser()
    const response = await submit(userId, wrongAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("locked")
    expect(openItemOf(response.body.quiz).validityRegex).toEqual("koira")
  })

  test("shows the answer key after full points", async () => {
    const userId = await newUser()
    const response = await submit(userId, correctAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("open")
    expect(response.body.userQuizState.pointsAwarded).toEqual(1)
    expect(openItemOf(response.body.quiz).validityRegex).toEqual("koira")
  })
})

describe("widget answer grading", () => {
  test("rejects duplicate option answers", async () => {
    const userId = await newUser()
    await submit(userId, {
      quizId,
      itemAnswers: [
        { quizItemId: openItemId, textData: "koira", optionAnswers: [] },
        {
          quizItemId: multiItemId,
          optionAnswers: [{ quizOptionId: optionA }, { quizOptionId: optionA }],
        },
      ],
    }).expect(400)
  })

  test("rejects duplicate item answers", async () => {
    const userId = await newUser()
    await submit(userId, {
      quizId,
      itemAnswers: [
        { quizItemId: openItemId, textData: "koira", optionAnswers: [] },
        { quizItemId: openItemId, textData: "koira", optionAnswers: [] },
      ],
    }).expect(400)
  })

  test("rejects item answers for another quiz's items", async () => {
    const userId = await newUser()
    await submit(userId, {
      ...correctAnswer(),
      itemAnswers: [
        ...correctAnswer().itemAnswers,
        { quizItemId: foreignItemId, textData: "koira", optionAnswers: [] },
      ],
    }).expect(400)
  })

  test("rejects option answers for another item's options", async () => {
    const userId = await newUser()
    await submit(userId, {
      quizId,
      itemAnswers: [
        { quizItemId: openItemId, textData: "koira", optionAnswers: [] },
        {
          quizItemId: multiItemId,
          optionAnswers: [{ quizOptionId: foreignOptionId }],
        },
      ],
    }).expect(400)
  })

  test("still accepts a stale answer to a deleted item", async () => {
    const userId = await newUser()
    const response = await submit(userId, {
      ...correctAnswer(),
      itemAnswers: [
        ...correctAnswer().itemAnswers,
        {
          quizItemId: deletedItemId,
          optionAnswers: [{ quizOptionId: deletedItemOption }],
        },
      ],
    }).expect(200)

    expect(response.body.userQuizState.pointsAwarded).toBeCloseTo(1)
  })

  const openAnswer = (textData: unknown) => ({
    quizId,
    itemAnswers: [
      { quizItemId: openItemId, textData, optionAnswers: [] },
      correctAnswer().itemAnswers[1],
    ],
  })

  test("accepts an open answer of the maximum length", async () => {
    const userId = await newUser()
    await submit(userId, openAnswer("a".repeat(10_000))).expect(200)
  })

  test("rejects a longer open answer", async () => {
    const userId = await newUser()
    await submit(userId, openAnswer("a".repeat(10_001))).expect(400)

    expect(await knex("quiz_answer").where("user_id", userId)).toHaveLength(0)
  })

  test("rejects a non-string open answer", async () => {
    const userId = await newUser()
    await submit(userId, openAnswer(["koira"])).expect(400)
  })

  test("reports an invalid validity regex as a bad request", async () => {
    await knex("quiz_item")
      .update({ validity_regex: "(" })
      .where("id", openItemId)
    const userId = await newUser()
    const response = await submit(userId, correctAnswer()).expect(400)
    expect(response.body.message).toEqual(
      "the item's answer check is misconfigured",
    )
  })

  test("counts an unanswered item as wrong", async () => {
    const userId = await newUser()
    const response = await submit(userId, {
      quizId,
      itemAnswers: [correctAnswer().itemAnswers[0]],
    }).expect(200)

    expect(response.body.userQuizState.pointsAwarded).toBeCloseTo(1 / 2)
  })
})

describe("widget answer tries", () => {
  test("parallel first submissions use one try", async () => {
    await setTries(1)
    const userId = await newUser()
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => submit(userId, wrongAnswer())),
    )

    expect(responses.map((r) => r.status).sort()).toEqual([
      200, 400, 400, 400, 400,
    ])
  })

  test("parallel later submissions respect the tries limit", async () => {
    await setTries(2)
    const userId = await newUser()
    await submit(userId, wrongAnswer()).expect(200)
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => submit(userId, wrongAnswer())),
    )

    expect(responses.map((r) => r.status).sort()).toEqual([
      200, 400, 400, 400, 400,
    ])
    const state = await knex("user_quiz_state")
      .where({ user_id: userId, quiz_id: quizId })
      .first()
    expect(state.tries).toEqual(2)
  })

  test("more parallel submissions than pooled connections all complete", async () => {
    const submissions = knex.client.pool.max + 2
    await setTries(submissions)
    const userId = await newUser()
    const responses = await Promise.all(
      Array.from({ length: submissions }, () => submit(userId, wrongAnswer())),
    )

    expect(responses.every((r) => r.status === 200)).toBe(true)
  })
})

describe("widget peer review", () => {
  const review = (overrides: object = {}) => ({
    quizAnswerId: reviewedAnswerId,
    peerReviewCollectionId,
    rejectedQuizAnswerIds: [],
    answers: [{ peerReviewQuestionId, value: 4 }],
    ...overrides,
  })

  const reviewer = async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    return userId
  }

  test("ignores a nested quiz answer", async () => {
    const userId = await reviewer()
    const answersBefore = await knex("quiz_answer").count()
    await giveReview(
      userId,
      review({
        quizAnswer: {
          quizId: peerReviewedQuizId,
          userId,
          languageId: "xy_YZ",
          status: "confirmed",
        },
      }),
    ).expect(200)

    expect(await knex("quiz_answer").count()).toEqual(answersBefore)
  })

  test("ignores nested peer review questions", async () => {
    const userId = await reviewer()
    const questionsBefore = await knex("peer_review_question").count()
    await giveReview(
      userId,
      review({
        answers: [
          {
            peerReviewQuestionId,
            value: 4,
            question: {
              peerReviewCollectionId: otherCollectionId,
              type: "grade",
              answerRequired: false,
              default: false,
              order: 9,
            },
          },
        ],
      }),
    ).expect(200)

    expect(await knex("peer_review_question").count()).toEqual(questionsBefore)
  })

  test("rejects a collection of another quiz", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        peerReviewCollectionId: otherCollectionId,
        answers: [{ peerReviewQuestionId: otherQuestionId, value: 4 }],
      }),
    ).expect(400)
  })

  test("rejects a question outside the collection", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        answers: [{ peerReviewQuestionId: otherQuestionId, value: 4 }],
      }),
    ).expect(400)
  })

  test("rejects a review without answers", async () => {
    const userId = await reviewer()
    await giveReview(userId, review({ answers: [] })).expect(400)

    expect(await knex("peer_review").where("user_id", userId)).toHaveLength(0)
  })

  test("rejects two answers to one question", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        answers: [
          { peerReviewQuestionId, value: 4 },
          { peerReviewQuestionId, value: 5 },
        ],
      }),
    ).expect(400)
  })

  test.each([1, 5])("accepts the grade %p", async (value) => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({ answers: [{ peerReviewQuestionId, value }] }),
    ).expect(200)
  })

  test.each([0, 6, 4.5, -1, "4"])("rejects the grade %p", async (value) => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({ answers: [{ peerReviewQuestionId, value }] }),
    ).expect(400)

    expect(await knex("peer_review").where("user_id", userId)).toHaveLength(0)
  })

  test("rejects text as the answer to a grade question", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({ answers: [{ peerReviewQuestionId, text: "great" }] }),
    ).expect(400)
  })

  test("accepts text as the answer to an essay question", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        answers: [
          { peerReviewQuestionId, value: 4 },
          { peerReviewQuestionId: essayQuestionId, value: null, text: "great" },
        ],
      }),
    ).expect(200)
  })

  test("rejects a grade as the answer to an essay question", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        answers: [{ peerReviewQuestionId: essayQuestionId, value: 5 }],
      }),
    ).expect(400)
  })

  test("rejects a non-string essay answer", async () => {
    const userId = await reviewer()
    await giveReview(
      userId,
      review({
        answers: [{ peerReviewQuestionId: essayQuestionId, text: ["great"] }],
      }),
    ).expect(400)
  })

  test("is refused from a user who has not answered the quiz", async () => {
    const userId = await newUser()
    await knex("user_quiz_state").insert({
      user_id: userId,
      quiz_id: peerReviewedQuizId,
      tries: 1,
      status: "locked",
    })
    await giveReview(userId, review()).expect(403)
  })

  test("is refused from a user whose answer was deleted", async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId, { deleted: true })
    await giveReview(userId, review()).expect(403)
  })

  test("rejects a superseded answer", async () => {
    const targetId = await answerPeerReviewedQuiz(await newUser(), {
      status: "deprecated",
    })
    const userId = await reviewer()
    const response = await giveReview(
      userId,
      review({ quizAnswerId: targetId }),
    ).expect(400)
    expect(response.body.message).toEqual("answer is not open for review")
  })

  test("rejects a deleted answer", async () => {
    const targetId = await answerPeerReviewedQuiz(await newUser(), {
      deleted: true,
    })
    const userId = await reviewer()
    const response = await giveReview(
      userId,
      review({ quizAnswerId: targetId }),
    ).expect(400)
    expect(response.body.message).toEqual("answer is not open for review")
  })

  test("rejects the reviewer's own answer", async () => {
    const userId = await newUser()
    const answerId = await answerPeerReviewedQuiz(userId)
    const response = await giveReview(
      userId,
      review({ quizAnswerId: answerId }),
    ).expect(400)
    expect(response.body.message).toEqual("User cannot review their own answer")
  })

  test("does not overwrite a state the reviewed student changes meanwhile", async () => {
    const userId = await reviewer()
    const targetUserId = await newUser()
    const answerId = await answerPeerReviewedQuiz(targetUserId)
    const response = await whileTriesChange(targetUserId, () =>
      giveReview(userId, review({ quizAnswerId: answerId })),
    )

    expect(response.status).toEqual(200)
    const state = await peerReviewedQuizState(targetUserId)
    expect(state.tries).toEqual(2)
    expect(state.peer_reviews_received).toEqual(1)
  })
})

describe("widget peer review candidates", () => {
  const getCandidates = (userId: number, quiz = peerReviewedQuizId) =>
    request(app.callback())
      .get(`/api/v2/widget/answers/${quiz}/get-candidates`)
      .set("Authorization", `bearer user-${userId}`)

  test("do not reveal reviewee identity or grading", async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    const response = await getCandidates(userId).expect(200)

    expect(response.body.length).toBeGreaterThan(0)
    for (const candidate of response.body) {
      expect(candidate.id).toBeDefined()
      expect(candidate.userId).toBeUndefined()
      expect(candidate.status).toBeUndefined()
      expect(candidate.correctnessCoefficient).toBeUndefined()
      for (const itemAnswer of candidate.itemAnswers) {
        expect(itemAnswer.quizItemId).toBeDefined()
        expect(itemAnswer.correct).toBeUndefined()
      }
    }
  })

  test("are refused to a user who has not answered the quiz", async () => {
    const userId = await newUser()
    await getCandidates(userId).expect(403)
  })

  test("are refused to a user whose answer was deleted", async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId, { deleted: true })
    await getCandidates(userId).expect(403)
  })

  test("are refused to a user whose only answer is superseded", async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId, { status: "deprecated" })
    await getCandidates(userId).expect(403)
  })

  test("are refused for a quiz without peer review", async () => {
    const userId = await newUser()
    await submit(userId, correctAnswer()).expect(200)
    await getCandidates(userId, quizId).expect(400)
  })

  test("leave out deleted answers", async () => {
    const deletedAnswerId = await answerPeerReviewedQuiz(await newUser(), {
      status: "given-more-than-enough",
      deleted: true,
    })
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    const response = await getCandidates(userId).expect(200)

    expect(response.body.map((answer: any) => answer.id)).not.toContain(
      deletedAnswerId,
    )
  })
})

describe("widget spam flags", () => {
  const reportSpam = (userId: number, quizAnswerId: string) =>
    request(app.callback())
      .post("/api/v2/widget/answers/report-spam")
      .set("Authorization", `bearer user-${userId}`)
      .send({ quizAnswerId })

  test("are accepted from another student of the quiz", async () => {
    const targetId = await answerPeerReviewedQuiz(await newUser())
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    await reportSpam(userId, targetId).expect(200)
  })

  test("are refused from a user who has not answered the quiz", async () => {
    const targetId = await answerPeerReviewedQuiz(await newUser())
    const userId = await newUser()
    await reportSpam(userId, targetId).expect(403)

    expect(
      await knex("spam_flag").where("quiz_answer_id", targetId),
    ).toHaveLength(0)
  })

  test("do not overwrite a state the flagged student changes meanwhile", async () => {
    const targetUserId = await newUser()
    const targetId = await answerPeerReviewedQuiz(targetUserId)
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    const response = await whileTriesChange(targetUserId, () =>
      reportSpam(userId, targetId),
    )

    expect(response.status).toEqual(200)
    const state = await peerReviewedQuizState(targetUserId)
    expect(state.tries).toEqual(2)
    expect(state.spam_flags).toEqual(1)
  })

  test("are refused on the user's own answer", async () => {
    const userId = await newUser()
    const answerId = await answerPeerReviewedQuiz(userId)
    await reportSpam(userId, answerId).expect(403)
  })

  test("are refused on a superseded answer", async () => {
    const targetId = await answerPeerReviewedQuiz(await newUser(), {
      status: "deprecated",
    })
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    const response = await reportSpam(userId, targetId).expect(400)
    expect(response.body.message).toEqual("answer is not open for review")

    expect(
      (await knex("quiz_answer").where("id", targetId).first()).status,
    ).toEqual("deprecated")
  })
})

describe("widget received peer reviews", () => {
  const getPeerReviews = (userId: number, quizAnswerId: string) =>
    request(app.callback())
      .get(`/api/v2/widget/answers/${quizAnswerId}/peer-reviews`)
      .set("Authorization", `bearer user-${userId}`)

  test("are shown to the answer's author", async () => {
    const userId = await newUser()
    const answerId = await answerPeerReviewedQuiz(userId)
    await getPeerReviews(userId, answerId).expect(200)
  })

  test("are hidden from other students", async () => {
    const userId = await newUser()
    await answerPeerReviewedQuiz(userId)
    await getPeerReviews(userId, reviewedAnswerId).expect(403)
  })

  test("are shown to the course's staff", async () => {
    const courseTeacherId = 1234
    await getPeerReviews(courseTeacherId, reviewedAnswerId).expect(200)
  })

  test("are hidden from another course's staff", async () => {
    const otherCourseTeacherId = 9876
    await getPeerReviews(otherCourseTeacherId, reviewedAnswerId).expect(403)
  })
})

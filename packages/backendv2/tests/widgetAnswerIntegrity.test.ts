import nock from "nock"
import request from "supertest"

import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
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
const otherQuizId = "2a0c2270-011e-40b2-8796-625764828034"
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

const giveReview = (userId: number, body: object) =>
  request(app.callback())
    .post("/api/v2/widget/answers/give-review")
    .set("Authorization", `bearer user-${userId}`)
    .set("Accept", "application/json")
    .send(body)

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
  await setTries(3)
})

describe("widget answer submission", () => {
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
    const openItem = items.find((item: any) => item.id === openItemId)
    const multiItem = items.find((item: any) => item.id === multiItemId)
    expect(openItem.validityRegex).toBeUndefined()
    expect(openItem.successMessage).toBeUndefined()
    for (const option of multiItem.options) {
      expect(option.correct).toBeUndefined()
    }
  })

  test("shows the answer key once the quiz is locked", async () => {
    await setTries(1)
    const userId = await newUser()
    const response = await submit(userId, wrongAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("locked")
    const openItem = response.body.quiz.items.find(
      (item: any) => item.id === openItemId,
    )
    expect(openItem.validityRegex).toEqual("koira")
  })

  test("shows the answer key after full points", async () => {
    const userId = await newUser()
    const response = await submit(userId, correctAnswer()).expect(200)

    expect(response.body.userQuizState.status).toEqual("open")
    expect(response.body.userQuizState.pointsAwarded).toEqual(1)
    const openItem = response.body.quiz.items.find(
      (item: any) => item.id === openItemId,
    )
    expect(openItem.validityRegex).toEqual("koira")
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

    expect(response.body.userQuizState.pointsAwarded).toBeCloseTo(2 / 3)
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
    await knex("user_quiz_state").insert({
      user_id: userId,
      quiz_id: peerReviewedQuizId,
      tries: 1,
      status: "locked",
    })
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
})

describe("widget peer review candidates", () => {
  test("do not reveal reviewee identity or grading", async () => {
    const userId = await newUser()
    const response = await request(app.callback())
      .get(`/api/v2/widget/answers/${peerReviewedQuizId}/get-candidates`)
      .set("Authorization", `bearer user-${userId}`)
      .expect(200)

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
})

import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { safeClean, safeSeed, configA } from "./util"
import _ from "lodash"
import { Model, snakeCaseMappers } from "objection"
import {
  QuizAnswerStatusModification,
  SpamFlag,
  QuizAnswer,
  Quiz,
  UserQuizState,
} from "../src/models"
import redis from "../config/redis"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.flushall()
  await redis.client?.quit()
})

describe("Dashboard: when the status of a quiz answer is manually changed", () => {
  beforeAll(async () => {
    await safeSeed(configA)
    await QuizAnswerStatusModification.query().delete()
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("teacher accept operation results in operation being logged", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"
    // confirm the answer in question
    const res = await request(app.callback())
      .post(`/api/v2/dashboard/answers/${quizAnswerId}/status`)
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })

    expect(res.status).toEqual(200)

    // fetch now updated logs
    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    if (logs != null) {
      expect(logs[0].modifierId).toEqual(1234)
      expect(logs[0].operation).toEqual("teacher-accept")
    }
  })

  test("teacher reject operation results in operation being logged", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"
    const res = await request(app.callback())
      .post(`/api/v2/dashboard/answers/${quizAnswerId}/status`)
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "rejected" })
    expect(res.status).toEqual(200)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    if (logs != null) {
      expect(logs[1].modifierId).toEqual(1234)
      expect(logs[1].operation).toEqual("teacher-reject")
    }
  })

  test("teacher suspect plagiarism operation results in operation being logged", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"
    const res = await request(app.callback())
      .post(`/api/v2/dashboard/answers/${quizAnswerId}/status`)
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "rejected", plagiarismSuspected: true })
    expect(res.status).toEqual(200)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    if (logs != null) {
      expect(logs[2].modifierId).toEqual(1234)
      expect(logs[2].operation).toEqual("teacher-suspects-plagiarism")
    }
  })
})

describe("Peer review spam:", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
    await safeSeed({
      directory: "./database/seeds",
      specific: "quizAnswerStatusChange.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  test("should not log a change when quiz answer status has not changed", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"

    const quizAnswerBeforeSpamFlag = await QuizAnswer.getById(quizAnswerId)

    await SpamFlag.reportSpam(quizAnswerId, 2345)

    const quizAnswerAfterSpamFlag = await QuizAnswer.getById(quizAnswerId)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    expect(quizAnswerAfterSpamFlag.status).toEqual(
      quizAnswerBeforeSpamFlag.status,
    )

    expect(logs).toEqual([])
  })

  test("should log a peer review spam operation when status has changed due to review spam threshold being exceeded", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"

    // log two more spams
    await SpamFlag.reportSpam(quizAnswerId, 3456)
    await SpamFlag.reportSpam(quizAnswerId, 4321)

    const quizAnswerAfterSpamFlag = await QuizAnswer.getById(quizAnswerId)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    expect(quizAnswerAfterSpamFlag.status).toEqual("spam")

    if (logs) {
      expect(logs[0].operation).toEqual("peer-review-spam")
    }
  })
})

describe("Peer review acceptance or rejection", () => {
  beforeAll(async () => {
    await safeSeed(configA)
    await safeSeed({
      directory: "./database/seeds",
      specific: "quizAnswerStatusChange.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("should log a peer review accept operation when status changes to confirmed", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const userQuizState = await UserQuizState.getByUserAndQuiz(1234, quiz.id)

    userQuizState.peerReviewsReceived = 2
    userQuizState.peerReviewsGiven = 3
    await knex.transaction(async trx => {
      await UserQuizState.upsert(userQuizState, trx)
    })

    await request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_1`)
      .set("Accept", "application/json")
      .send({
        quizAnswerId,
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        rejectedQuizAnswerIds: null,
        answers: [
          {
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 4,
          },
        ],
      })
      .expect(200)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    if (logs) {
      expect(logs[0].operation).toEqual("peer-review-accept")
    }
  })

  test("should log a peer review reject operation when status changes to rejected", async () => {
    const quizAnswerId = "ae29c3be-b5b6-4901-8588-5b0e88774748"
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const userQuizState = await UserQuizState.getByUserAndQuiz(2345, quiz.id)

    userQuizState.peerReviewsReceived = 2
    userQuizState.peerReviewsGiven = 3
    await knex.transaction(async trx => {
      await UserQuizState.upsert(userQuizState, trx)
    })

    await request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_1`)
      .set("Accept", "application/json")
      .send({
        quizAnswerId,
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        rejectedQuizAnswerIds: null,
        answers: [
          {
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 1,
          },
        ],
      })
      .expect(200)

    const logs = await QuizAnswerStatusModification.getAllByQuizAnswerId(
      quizAnswerId,
    )

    if (logs) {
      expect(logs[0].operation).toEqual("peer-review-reject")
    }
  })
})

describe("When the status of answers are modified in batch", () => {
  beforeAll(async () => {
    await safeSeed(configA)
    await safeSeed({
      directory: "./database/seeds",
      specific: "quizAnswerStatusChange.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    await QuizAnswerStatusModification.query().delete()
    checkTmcCredentials()
  })

  test("manually accepting 2 answers should result in teacher-accept operation being logged for 2 answers", async () => {
    const quizAnswerIds = [
      "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      "1f5fd7e2-1d70-414c-8ef8-49a1de7ccbbf",
    ]

    await request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "confirmed", answerIds: quizAnswerIds })
      .expect(200)

    const logs = await QuizAnswerStatusModification.getAll()

    if (logs != null) {
      expect(logs[0].operation).toEqual("teacher-accept")
      expect(logs[1].operation).toEqual("teacher-accept")
    }
  })

  test("manually rejecting 2 answers should result in teacher-reject operation being logged for 2 answers", async () => {
    const quizAnswerIds = [
      "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      "1f5fd7e2-1d70-414c-8ef8-49a1de7ccbbf",
    ]

    await request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "rejected", answerIds: quizAnswerIds })
      .expect(200)

    const logs = await QuizAnswerStatusModification.getAll()

    if (logs != null) {
      expect(logs[0].operation).toEqual("teacher-reject")
      expect(logs[1].operation).toEqual("teacher-reject")
    }
  })

  test("manually suspecting 2 answers as plagiarism should result in teacher-suspects-plagiarism operation being logged for 2 answers", async () => {
    const quizAnswerIds = [
      "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      "1f5fd7e2-1d70-414c-8ef8-49a1de7ccbbf",
    ]

    await request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({
        status: "rejected",
        answerIds: quizAnswerIds,
        plagiarismSuspected: true,
      })
      .expect(200)

    const logs = await QuizAnswerStatusModification.getAll()

    if (logs != null) {
      expect(logs[0].operation).toEqual("teacher-suspects-plagiarism")
      expect(logs[1].operation).toEqual("teacher-suspects-plagiarism")
    }
  })
})

const checkTmcCredentials = () => {
  nock("https://tmc.mooc.fi")
    .get("/api/v8/users/current?show_user_fields=true")
    .reply(function() {
      const auth = this.req.headers.authorization
      if (auth === "Bearer pleb_token") {
        return [
          200,
          {
            administrator: false,
          } as UserInfo,
        ]
      }
      if (auth === "Bearer PLEB_TOKEN_1") {
        return [
          200,
          {
            id: 9876,
            administrator: false,
          } as UserInfo,
        ]
      }
      if (auth === "Bearer admin_token") {
        return [
          200,
          {
            id: 1234,
            administrator: true,
          } as UserInfo,
        ]
      }
    })
}

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
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("teacher accept operation results in operation being logged", async () => {
    const quizAnswerId = "0cb3e4de-fc11-4aac-be45-06312aa4677c"
    const res = await request(app.callback())
      .post(`/api/v2/dashboard/answers/${quizAnswerId}/status`)
      .set("Authorization", `bearer admin_token`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })
    expect(res.status).toEqual(200)

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
})

describe("Peer review assessment:", () => {
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
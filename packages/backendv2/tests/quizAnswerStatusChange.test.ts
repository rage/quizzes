import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { safeClean, safeSeed, configA, dateTime, uuid } from "./util"
import _ from "lodash"
import { Model, snakeCaseMappers } from "objection"
import { QuizAnswerStatusModification } from "../src/models"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

describe("Dashboard: updating status of a quiz answer", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("responds with 401 when bad token provided", async () => {
    const res = await request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")

    expect(res.status).toEqual(401)
  })

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

import { QuizAnswer } from "../src/models"
import { BadRequestError, NotFoundError } from "./../src/util/error"
import nock from "nock"
import request from "supertest"
import app from "../app"
import knex from "../database/knex"
import { Model, snakeCaseMappers } from "objection"

import { UserInfo } from "../src/types"

const knexCleaner = require("knex-cleaner")

const safeClean = async () => {
  if (process.env.NODE_ENV === "test") {
    return await knexCleaner.clean(knex)
  }
}

const safeSeed = async (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    await knex.seed.run(config)
  }
}

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

describe("dashboard: updating the status of multiple quiz answers should", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 6666,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer admin_token") {
          return [
            200,
            {
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({ answerIds: ["0cb3e4de-fc11-4aac-be45-06312aa4677c"] })
      .expect(403, done)
  })

  test("throw bad request if no answer ids provided", done => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ answerIds: [] })
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No answer ids provided.")
      })
      .expect(400, done)
  })

  test("throw not found error if no course found for answer ids", done => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({
        answerIds: [
          "af87b380-743a-4200-900e-b4bba8207381",
          "f7bd5724-1f80-4297-8134-b7c980d17a7a",
        ],
      })
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(
          "No course found for answer id: af87b380-743a-4200-900e-b4bba8207381",
        )
      })
      .expect(404, done)
  })

  test("throw bad request error if no status provided for status update", done => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({
        answerIds: ["0cb3e4de-fc11-4aac-be45-06312aa4677c"],
        status: "bad status",
      })
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Invalid answer status provided.")
      })
      .expect(400, done)
  })

  describe("on successful bulk status change", () => {
    test("return 200", done => {
      request(app.callback())
        .post("/api/v2/dashboard/answers/status")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({
          answerIds: ["3b17d66d-b309-4958-b8b8-4364f0f90b1e"],
          status: "confirmed",
        })
        .expect(200, done)
    })

    test("return 2 answers with confirmed statuses when 2 confirmed", done => {
      request(app.callback())
        .post("/api/v2/dashboard/answers/status")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({
          answerIds: [
            "3b17d66d-b309-4958-b8b8-4364f0f90b1e",
            "1440c6ac-109b-4fd3-af47-7c39c24f2a5c",
          ],
          status: "confirmed",
        })
        .expect(response => {
          const quizAnswers: QuizAnswer[] = response.body
          expect(quizAnswers.length).toEqual(2)
          expect(quizAnswers[0].status === "confirmed")
          expect(quizAnswers[1].status === "confirmed")
        })
        .expect(200, done)
    })

    test("return 3 answers with rejected statuses when 3 rejeceted", done => {
      request(app.callback())
        .post("/api/v2/dashboard/answers/status")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({
          answerIds: [
            "3b17d66d-b309-4958-b8b8-4364f0f90b1e",
            "1440c6ac-109b-4fd3-af47-7c39c24f2a5c",
            "3b17d66d-b309-4958-b8b8-4364f0f90b1e",
          ],
          status: "rejected",
        })
        .expect(response => {
          const quizAnswers: QuizAnswer[] = response.body
          expect(quizAnswers.length).toEqual(3)
          expect(quizAnswers[0].status === "rejected")
          expect(quizAnswers[1].status === "rejected")
          expect(quizAnswers[2].status === "rejected")
        })
        .expect(200, done)
    })
  })
})

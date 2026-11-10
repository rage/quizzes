import nock from "nock"
import { Model, snakeCaseMappers } from "objection"
import request from "supertest"

import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
import { QuizAnswer, UserQuizState } from "../src/models"
import { UserInfo } from "../src/types"
import { BadRequestError, NotFoundError } from "./../src/util/error"

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

afterEach(async () => {
  return redis.client?.flushall()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

const quizWithoutUserQuizStatesId = "2a0c2270-011e-40b2-8796-625764828034"

// The b.ts seed creates manual-review answers with random ids for users 1-15.
const answerIdWithoutUserQuizState = async (userId: number) => {
  const answer = await QuizAnswer.query()
    .where("user_id", userId)
    .andWhere("quiz_id", quizWithoutUserQuizStatesId)
    .first()
    .throwIfNotFound()
  return answer.id
}

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
      .reply(function () {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer TEACHER_TOKEN") {
          return [
            200,
            {
              id: 9876,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer ADMIN_TOKEN") {
          return [
            200,
            {
              administrator: true,
            } as UserInfo,
          ]
        }
        return [401]
      })
  })

  test("respond with 401 if invalid credentials", (done) => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", (done) => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({ answerIds: ["0cb3e4de-fc11-4aac-be45-06312aa4677c"] })
      .expect(403, done)
  })

  test("throw bad request if no answer ids provided", (done) => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ answerIds: [] })
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No answer ids provided.")
      })
      .expect(400, done)
  })

  test("throw not found error if no course found for answer ids", (done) => {
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
      .expect((response) => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(
          "No course found for answer id: af87b380-743a-4200-900e-b4bba8207381",
        )
      })
      .expect(404, done)
  })

  test("respond with 403 if any answer is in a course the user cannot grade", async () => {
    const answerInGradableCourse = await answerIdWithoutUserQuizState(3)
    const answerInOtherCourse = "0cb3e4de-fc11-4aac-be45-06312aa4677c"

    await request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer TEACHER_TOKEN`)
      .set("Accept", "application/json")
      .send({
        answerIds: [answerInGradableCourse, answerInOtherCourse],
        status: "rejected",
      })
      .expect(403)

    const untouched = await QuizAnswer.query().findById(answerInOtherCourse)
    expect(untouched?.status).toEqual("given-enough")
  })

  test("throw not found error if any answer id is unknown", async () => {
    const unknownAnswerId = "af87b380-743a-4200-900e-b4bba8207381"
    const response = await request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({
        answerIds: [await answerIdWithoutUserQuizState(4), unknownAnswerId],
        status: "rejected",
      })
      .expect(404)

    expect(response.body.message).toEqual(
      `No course found for answer id: ${unknownAnswerId}`,
    )
  })

  test("throw bad request error if no status provided for status update", (done) => {
    request(app.callback())
      .post("/api/v2/dashboard/answers/status")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({
        answerIds: ["0cb3e4de-fc11-4aac-be45-06312aa4677c"],
        status: "bad status",
      })
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Invalid answer status provided.")
      })
      .expect(400, done)
  })

  describe("on successful bulk status change", () => {
    test("return 200", (done) => {
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

    test("return 2 answers with confirmed statuses when 2 confirmed", (done) => {
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
        .expect((response) => {
          const quizAnswers: QuizAnswer[] = response.body
          expect(quizAnswers.length).toEqual(2)
          expect(quizAnswers[0].status === "confirmed")
          expect(quizAnswers[1].status === "confirmed")
        })
        .expect(200, done)
    })

    test("return 3 answers with rejected statuses when 3 rejeceted", (done) => {
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
        .expect((response) => {
          const quizAnswers: QuizAnswer[] = response.body
          expect(quizAnswers.length).toEqual(3)
          expect(quizAnswers[0].status === "rejected")
          expect(quizAnswers[1].status === "rejected")
          expect(quizAnswers[2].status === "rejected")
        })
        .expect(200, done)
    })

    test("create the missing user quiz state when confirming", async () => {
      const response = await request(app.callback())
        .post("/api/v2/dashboard/answers/status")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({
          answerIds: [await answerIdWithoutUserQuizState(1)],
          status: "confirmed",
        })
        .expect(200)

      expect(response.body[0].status).toEqual("confirmed")
      const userQuizState = await UserQuizState.getByUserAndQuiz(
        1,
        quizWithoutUserQuizStatesId,
      )
      expect(userQuizState?.pointsAwarded).toEqual(1)
      expect(userQuizState?.tries).toEqual(1)
    })

    test("reject an answer that has no user quiz state", async () => {
      const response = await request(app.callback())
        .post("/api/v2/dashboard/answers/status")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({
          answerIds: [await answerIdWithoutUserQuizState(2)],
          status: "rejected",
        })
        .expect(200)

      expect(response.body[0].status).toEqual("rejected")
    })
  })
})

describe("dashboard: deleting a quiz answer should", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(200, { administrator: true } as UserInfo)
  })

  test("delete an answer that has no user quiz state", async () => {
    const answerId = await answerIdWithoutUserQuizState(3)
    const response = await request(app.callback())
      .delete(`/api/v2/dashboard/answers/${answerId}`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .expect(200)

    expect(response.body.deleted).toEqual(true)
    const userQuizState = await UserQuizState.getByUserAndQuiz(
      3,
      quizWithoutUserQuizStatesId,
    )
    expect(userQuizState).toBeUndefined()
  })
})

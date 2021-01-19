import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { input } from "./data"
import { UserInfo } from "../src/types"

import { safeClean, safeSeed, configA } from "./util"
import _ from "lodash"

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

describe("Soft delete peer review questions", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => userSetup())

  it("Responds with 401 on bad token", done => {
    const quiz = input.newQuiz
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(401)
      .end(done)
  })

  it("Soft deletes peer review question", done => {
    const quiz = input.newQuiz
    quiz.peerReviewCollections[0].questions = []
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(200)
      .expect(response => {
        const received = response.body
        _.isEqual(received, quiz)
      })
      .end(done)
  })
})

describe("Soft delete peer review collections", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => userSetup())

  it("Responds with 401 on bad token", done => {
    const quiz = input.newQuiz
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(401)
      .end(done)
  })

  it("Soft deletes peer review collection", done => {
    const quiz = input.newQuiz
    quiz.peerReviewCollections = []
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(200)
      .expect(response => {
        const received = response.body
        _.isEqual(received, quiz)
      })
      .end(done)
  })
})

describe("Soft delete quiz item options", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => userSetup())

  it("Responds with 401 on bad token", done => {
    const quiz = input.newQuiz
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(401)
      .end(done)
  })

  it("Soft deletes quiz item option", done => {
    const quiz = input.newQuiz
    quiz.items[0].options = []
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz)
      .expect(200)
      .expect(response => {
        const received = response.body
        _.isEqual(received, quiz)
      })
      .end(done)
  })
})

describe("Soft delete quiz items", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(() => userSetup())

  it("Responds with 401 on bad token", done => {
    const quiz1 = input.newQuiz
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz1)
      .expect(401)
      .end(done)
  })

  it("Soft deletes quiz item", done => {
    const quiz2 = input.newQuiz
    quiz2.items.shift()
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(quiz2)
      .expect(200)
      .expect(response => {
        const received = response.body
        _.isEqual(received, quiz2)
      })
      .end(done)
  })
})

const userSetup = () => {
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
}

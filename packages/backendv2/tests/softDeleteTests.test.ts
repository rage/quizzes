import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { input } from "./data"
import { UserInfo } from "../src/types"

import { safeClean, safeSeed, configA } from "./util"
import _ from "lodash"
import { Model, snakeCaseMappers } from "objection"
import { PeerReviewCollection, PeerReviewQuestion, Quiz, QuizItem, QuizOption } from "../src/models"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

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

  it("Soft deletes peer review question", async done => {
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const peerReviewQuestionId = quiz.peerReviewCollections[0].questions[0].id
    quiz.peerReviewCollections[0].questions.shift()
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
      .end(async () => {
        const deletedQuestion = await PeerReviewQuestion.getById(peerReviewQuestionId)
        expect(deletedQuestion.deleted).toEqual(true)
        done()
      })
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

  it("Soft deletes peer review collection", async done => {
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const peerReviewCollectionId = quiz.peerReviewCollections[0].id
    quiz.peerReviewCollections.shift()
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
      .end(async () => {
        const deletedPeerReviewCollection = await PeerReviewCollection.getById(peerReviewCollectionId)
        expect(deletedPeerReviewCollection.deleted).toEqual(true)
        done()
      })
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

  it("Soft deletes quiz item option", async done => {
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const quizOptionId = quiz.items[1].options[0].id
    quiz.items[1].options.shift()
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
      .end(async () => {
        const deletedQuizOption = await QuizOption.getById(quizOptionId)
        expect(deletedQuizOption.deleted).toEqual(true)
        done()
      })
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

  it("Soft deletes quiz item", async done => {
    const quiz = await Quiz.getById("4bf4cf2f-3058-4311-8d16-26d781261af7")
    const quizItemId = quiz.items[0].id
    quiz.items.shift()
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
      .end(async () => {
        const deletedQuizItem = await QuizItem.getById(quizItemId)
        expect(deletedQuizItem.deleted).toEqual(true)
        done()
      })
  })
})

const userSetup = () => {
  nock("https://tmc.mooc.fi")
    .get("/api/v8/users/current?show_user_fields=true")
    .reply(function () {
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

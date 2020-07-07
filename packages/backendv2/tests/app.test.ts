import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { Quiz } from "../src/models"
import { input, validation } from "./data"

const knexCleaner = require("knex-cleaner")

beforeEach(async () => {
  await knex.seed.run()
})

afterEach(async () => {
  nock.cleanAll()
  await knexCleaner.clean(knex)
})

afterAll(async () => {
  await knex.destroy()
})

const expectQuizToEqual = (received: Quiz, expected: any) => {
  const receivedItems = received.items
  const expectedItems = expected.items
  expect(receivedItems).toHaveLength(expectedItems.length)
  for (const expectedItem of expectedItems) {
    expect(receivedItems).toContainEqual(expectedItem)
  }
  const receivedOptions = receivedItems.map(item => item.options).flat()
  const expectedOptions = expectedItems.map((item: any) => item.options).flat()
  expect(receivedOptions).toHaveLength(expectedOptions.length)
  for (const expectedOption of expectedOptions) {
    expect(receivedOptions).toContainEqual(expectedOption)
  }
  const receivedPeerReviews = received.peerReviews
  const expectedPeerReviews = expected.peerReviews
  expect(receivedPeerReviews).toHaveLength(expectedPeerReviews.length)
  for (const expectedPeerReview of expectedPeerReviews) {
    expect(receivedPeerReviews).toContainEqual(expectedPeerReview)
  }
  const receivedPeerReviewQuestions = receivedPeerReviews
    .map(peerReview => peerReview.questions)
    .flat()
  const expectedPeerReviewQuestions = expectedPeerReviews
    .map((peerReview: any) => peerReview.questions)
    .flat()
  expect(receivedPeerReviewQuestions).toHaveLength(
    expectedPeerReviewQuestions.length,
  )
  for (const expectedPeerReviewQuestion of expectedPeerReviewQuestions) {
    expect(receivedPeerReviewQuestions).toContainEqual(
      expectedPeerReviewQuestion,
    )
  }
  const expectedClone = { ...expected }
  delete received.items
  delete expectedClone.items
  delete received.peerReviews
  delete expectedClone.peerReviews
  expect(received).toStrictEqual(expectedClone)
}

describe("dashboard: get courses", () => {
  beforeEach(async () => {
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
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient priviledge", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("reply with courses on valid request", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(200)
      .expect(response => {
        const received = response.body
        expect(received).toHaveLength(2)
        expect(
          received.sort((o1: any, o2: any) => o1.id.localeCompare(o2.id)),
        ).toStrictEqual([validation.course1, validation.course2])
      })
      .end(done)
  })
})

describe("dashboard: get quizzes by course id", () => {
  beforeEach(async () => {
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
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", async done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", async done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("reply with course quizzes on valid request", async done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(200)
      .expect(response => {
        const received = response.body.sort(
          (o1: any, o2: any) => -o1.id.localeCompare(o2.id),
        )
        expect(received).toHaveLength(2)
        expectQuizToEqual(received[0], validation.quiz1)
        expectQuizToEqual(received[1], validation.quiz2)
      })
      .end(done)
  })
})

describe("dashboard: get quiz by id", () => {
  beforeEach(async () => {
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
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with 404 if invalid quiz id", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af8")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(404, done)
  })

  test("reply with quiz on valid request", async done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(200)
      .expect(response => {
        const received = response.body
        expectQuizToEqual(received, validation.quiz1)
      })
      .end(done)
  })
})

describe("dashboard: save quiz", () => {
  beforeEach(async () => {
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
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with error if required field missing", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ ...input.newQuiz, part: null })
      .expect(500, done)
  })

  test("respond with 401 if invalid credentials", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(401, done)
  })

  test("respond with 403 if invalid credentials", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(403, done)
  })

  test("save valid quiz", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(200)
      .expect(response => {
        const received = response.body
        expectQuizToEqual(received, validation.newQuiz)
      })
      .end(done)
  })

  test("update existing quiz", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(input.quizUpdate)
      .expect(200)
      .expect(response => {
        const received = response.body
        expectQuizToEqual(received, validation.quizUpdate)
      })
      .end(done)
  })
})

describe("widget: save quiz answer", () => {
  beforeEach(async () => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer 1234") {
          return [
            200,
            {
              id: 1234,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer 4321") {
          return [
            200,
            {
              id: 4321,
            } as UserInfo,
          ]
        }
      })
  })

  test("no answer past deadline", async done => {
    request(app.callback())
      .post("/api/v2/widget/answer")
      .set("Authorization", `bearer 1234`)
      .set("Accept", "application/json")
      .send(input.quizAnswerPastDeadline)
      .expect(400)
      .expect(response =>
        expect(response.body.message).toMatch("no submission past deadline"),
      )
      .end(done)
  })

  test("no answers exceeding number of tries", async done => {
    request(app.callback())
      .post("/api/v2/widget/answer")
      .set("Authorization", `bearer 4321`)
      .set("Accept", "application/json")
      .send(input.quizAnswerAlreadyAnswered)
      .expect(400)
      .expect(response =>
        expect(response.body.message).toMatch("already answered"),
      )
      .end(done)
  })

  test("no answers without item answers", async done => {
    const quizAnswer = { ...input.quizAnswerOpen }
    delete quizAnswer.itemAnswers
    request(app.callback())
      .post("/api/v2/widget/answer")
      .set("Authorization", `bearer 4321`)
      .set("Accept", "application/json")
      .send(quizAnswer)
      .expect(400)
      .expect(response =>
        expect(response.body.message).toMatch("item answers missing"),
      )
      .end(done)
  })

  test("save", async done => {
    request(app.callback())
      .post("/api/v2/widget/answer")
      .set("Authorization", `bearer 1234`)
      .set("Accept", "application/json")
      .send(input.quizAnswerOpen)
      .expect(200)
      // .expect(response => console.log(response.body))
      .end(done)
  })
})

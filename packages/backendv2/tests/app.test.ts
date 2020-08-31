import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { Quiz, QuizAnswer } from "../src/models"
import { input, validation } from "./data"

const knexCleaner = require("knex-cleaner")

const safeClean = () => {
  if (process.env.NODE_ENV === "test") {
    return knexCleaner.clean(knex)
  }
}

const safeSeed = (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    return knex.seed.run(config)
  }
}

afterAll(() => {
  return knex.destroy()
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
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
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
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient priviledge", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("reply with courses on valid request", done => {
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
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
  })

  beforeEach(() => {
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
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })
  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 2345,
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

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("reply with course quizzes on valid request", done => {
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
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 2345,
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

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with 404 if invalid quiz id", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af8")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(404, done)
  })

  test("reply with quiz on valid request", done => {
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
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 2345,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer admin_token") {
          return [
            200,
            {
              id: 4000,
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with error if required field missing", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ ...input.newQuiz, part: null })
      .expect(400, done)
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(401, done)
  })

  test("respond with 403 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(403, done)
  })

  test("save valid quiz", done => {
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

  test("update existing quiz", done => {
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
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
    })
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

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
      .set("Authorization", `bearer 1234`)
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

describe("dashboard: get answer by id", () => {
  beforeAll(() => {
    return safeSeed()
  })

  afterAll(() => {
    return knexCleaner.clean(knex)
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 5555,
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
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("get answer by id", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received = response.body
        expect(received).toStrictEqual(validation.quizAnswerValidator1)
      })
      .expect(200, done)
  })
})

describe("dashboard: get answers by quiz id", () => {
  beforeAll(() => {
    return safeSeed()
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 1234,
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

  test("get answers by quiz id: page 1, filter confirmed", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=confirmed",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(20)
        expect(states.size).toBe(1)
        expect(states.has("confirmed")).toBe(true)
      })
      .expect(200, done)
  })

  test("get answers by quiz id: page 2", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=deprecated",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(10)
        expect(states.size).toBe(1)
        expect(states.has("deprecated")).toBe(true)
      })
      .expect(200, done)
  })

  test("get answers by quiz id: page 3, one status filter", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=manual-review",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(15)
        expect(states.size).toBe(1)
        expect(states.has("manual-review")).toBe(true)
      })
      .expect(200, done)
  })

  test("get answers by quiz id: page 4, two status filter", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=manual-review,confirmed",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(20)
        expect(states.size).toBe(2)
        expect(states.has("deprecated")).toBe(false)
      })
      .expect(200, done)
  })
})

describe("dashboard: get manual review answers", () => {
  beforeAll(() => {
    return safeSeed()
  })

  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 1234,
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

  afterAll(() => {
    return knexCleaner.clean(knex)
  })

  beforeEach(() => {
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=0&size=10",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=0&size=10",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with correct page data 1", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=0&size=10",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        expect(received).toHaveLength(10)
        expect(
          received.filter(answer => answer.status === "manual-review"),
        ).toHaveLength(received.length)
      })
      .expect(200, done)
  })

  test("respond with correct page data 2", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=1&size=10",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        expect(received).toHaveLength(5)
        expect(
          received.filter(answer => answer.status === "manual-review"),
        ).toHaveLength(received.length)
      })
      .expect(200, done)
  })
})

describe("dashboard: update manual review status", () => {
  beforeAll(() => {
    return safeSeed({
      directory: "./database/seeds",
      specific: "a.ts",
    })
  })
  afterAll(() => {
    nock.cleanAll()
    return safeClean()
  })

  beforeEach(() => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 2345,
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

  beforeEach(() => {
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })
      .expect(403, done)
  })

  test("respond with 400 if invalid status", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ status: "submitted" })
      .expect(response => {
        const received = response.body
        expect(received.message).toMatch("invalid status")
      })
      .expect(400, done)
  })

  test("update valid status", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })
      .expect(response => {
        const received: QuizAnswer = response.body
        expect(received.status).toEqual("confirmed")
      })
      .expect(200, done)
  })
})

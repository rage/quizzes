import request from "supertest"
import { v4 as uuidv4 } from "uuid"
import nock from "nock"
const knexCleaner = require("knex-cleaner")
import app from "../app"
import knex from "../database/knex"
import { QuizAnswer, Course } from "../src/models"
import { input, userAbilities, validation } from "./data"
import { UserInfo } from "../src/types"
import { BadRequestError, NotFoundError } from "../src/util/error"

import {
  safeClean,
  safeSeed,
  expectQuizToEqual,
  configA,
  uuid as uuidPattern,
} from "./util"

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

describe("dashboard: get courses", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
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
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
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
describe("dashboard: get single course should", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
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
      .get("/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with 404 if invalid course id", done => {
    const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44c"
    request(app.callback())
      .get(`/api/v2/dashboard/courses/${courseId}`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`course not found: ${courseId}`)
      })
      .expect(404, done)
  })
  describe("on valid request: ", () => {
    test("reply with course on valid request", done => {
      request(app.callback())
        .get("/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b")
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .expect(200)
        .expect(response => {
          const received = response.body
          expect(received).toStrictEqual(validation.singleCourse)
        })
        .end(done)
    })
  })
})

describe("dashboard - courses: count answers requiring attention should", () => {
  beforeAll(async () => {
    await safeSeed({ directory: "./database/seeds" })
  })

  afterAll(async () => {
    nock.cleanAll()
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
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with 404 if invalid course id", done => {
    const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44c"
    request(app.callback())
      .get(
        `/api/v2/dashboard/courses/${courseId}/count-answers-requiring-attention`,
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`course not found: ${courseId}`)
      })
      .expect(404, done)
  })

  describe("on valid request:", () => {
    test("return 0 when none require attention", done => {
      request(app.callback())
        .get(
          "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/count-answers-requiring-attention",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .expect(200)
        .expect(response => {
          const received = response.body
          expect(received).toMatchObject({})
        })
        .end(done)
    })
    test("return correct quiz id and count when there are answers requiring attention", done => {
      request(app.callback())
        .get(
          "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/count-answers-requiring-attention",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .expect(200)
        .expect(response => {
          const received = response.body
          expect(received).toMatchObject({
            "2a0c2270-011e-40b2-8796-625764828034": "15",
          })
        })
        .end(done)
    })
  })
})

describe("dashboard: get quizzes by course id", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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

describe("dashboard: get answer by id", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  beforeAll(async () => {
    await safeSeed()
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  beforeAll(async () => {
    await safeSeed()
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  beforeAll(async () => {
    await safeSeed(configA)
  })
  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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

describe("test user progress", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
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
  test("no user progress", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/current/progress",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual([])
      })
      .expect(200, done)
  })

  test("user progress", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/user/current/progress",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(validation.userProgressValidator)
      })
      .expect(200, done)
  })
})

describe("dashboard - courses: duplicating course should", () => {
  beforeAll(async () => {
    await safeSeed({ directory: "./database/seeds" })
  })

  afterAll(async () => {
    nock.cleanAll()
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
      .post(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/duplicate-course",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/duplicate-course",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("respond with 404 if invalid course id", done => {
    const invalidCourseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44c"
    request(app.callback())
      .post(`/api/v2/dashboard/courses/${invalidCourseId}/duplicate-course`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`course not found: ${invalidCourseId}`)
      })
      .expect(404, done)
  })
  test("throw BadRequestError if provided language id does not exist in db", done => {
    const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
    const langIdInvalid = "ff_YY"
    request(app.callback())
      .post(`/api/v2/dashboard/courses/${courseId}/duplicate-course`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({ ...input.duplicateCourseValid, lang: langIdInvalid })
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual(
          `Invalid language id provided: ${langIdInvalid}`,
        )
      })
      .expect(400, done)
  })

  describe("on valid request:", () => {
    test("return success and the id of the duplicate ", done => {
      const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
      request(app.callback())
        .post(`/api/v2/dashboard/courses/${courseId}/duplicate-course`)
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .send(input.duplicateCourseValid)
        .expect(response => {
          expect(response.body).toStrictEqual(validation.duplicateCourse)
        })
        .expect(200, done)
    })
    test("set defaults for new course when title and abbreviation missing ", async done => {
      const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
      request(app.callback())
        .post(`/api/v2/dashboard/courses/${courseId}/duplicate-course`)
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .send({ ...input.duplicateCourseValid, name: null, abbr: null })
        .expect(async response => {
          const duplicate = await Course.getFlattenedById(
            response.body.newCourseId,
          )
          expect(duplicate.title).toContain("(duplicate) [title not set]")
          expect(duplicate.abbreviation).toContain(
            "(duplicate) [title not set]",
          )
        })
        .expect(200, done)
    })
  })
})

//TODO: figure out how to parse the csv stream
describe("dashboard - courses: downloading a correspondence file should", () => {
  beforeAll(async () => {
    await safeSeed({ directory: "./database/seeds" })
  })

  afterAll(async () => {
    nock.cleanAll()
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
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("should return 200 on successful request", done => {
    request(app.callback())
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send(input.correspondenceIds)
      .expect(async response => {
        //TODO: asserts on response
        console.log(response.body)
      })
      .expect(200, done)
  })
})

describe("dashboard: get current users abilities", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async done => {
    nock.cleanAll()
    await safeClean()
    done()
  })

  test("dashboard: get current users abilities, teacher", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
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
              administrator: true,
            } as UserInfo,
          ]
        }
      })
    request(app.callback())
      .get("/api/v2/dashboard/users/current/abilities")
      .set("Authorization", "bearer pleb_token")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(userAbilities.abilities.teacher)
      })
      .expect(200, done)
  })

  test("dashboard: get current user abilities, assistant", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer pleb_token") {
          return [
            200,
            {
              id: 8765,
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
    request(app.callback())
      .get("/api/v2/dashboard/users/current/abilities")
      .set("Authorization", "bearer pleb_token")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(userAbilities.abilities.assistant)
      })
      .expect(200, done)
  })
})
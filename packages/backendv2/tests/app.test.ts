import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import data from "./data"
import { QuizAnswer } from "../src/models"

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
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("no roles receives empty array", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(response => {
        expect(response.body).toEqual([])
      })
      .expect(200, done)
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
        ).toStrictEqual([data.courseValidator1, data.courseValidator2])
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
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
        const received = response.body
        expect(received).toHaveLength(2)
        expect(
          received.sort((o1: any, o2: any) => -o1.id.localeCompare(o2.id)),
        ).toStrictEqual([data.quizValidator1, data.quizValidator2])
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
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
        expect(received).toStrictEqual(data.quizValidator1)
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
      .send({ ...data.newQuiz, part: null })
      .expect(400, done)
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(data.newQuiz)
      .expect(401, done)
  })

  test("respond with 403 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send(data.newQuiz)
      .expect(403, done)
  })

  test("save valid quiz", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(data.newQuiz)
      .expect(200)
      .expect(response => {
        const received = response.body
        expect(received).toStrictEqual(data.newQuizValidator)
      })
      .end(done)
  })

  test("update existing quiz", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(data.quizUpdate)
      .expect(200)
      .expect(response => {
        const received = response.body
        expect(received).toStrictEqual(data.quizUpdateValidator)
      })
      .end(done)
  })
})

describe("dashboard: get answer by id", () => {
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
        expect(received).toStrictEqual(data.quizAnswerValidator1)
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=10",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=10",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403, done)
  })

  test("get answers by quiz id: page 1", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        expect(received).toHaveLength(20)
        expect(
          received.map(answer => answer.status).includes("deprecated"),
        ).toBe(false)
      })
      .expect(200, done)
  })

  test("get answers by quiz id: page 2", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=1&size=20",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        expect(received).toHaveLength(15)
        expect(
          received.map(answer => answer.status).includes("deprecated"),
        ).toBe(false)
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

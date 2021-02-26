import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { QuizAnswer, Course } from "../src/models"
import { input, userAbilities, validation, possibleAnswerStates } from "./data"
import { UserInfo } from "../src/types"
import { BadRequestError, NotFoundError } from "../src/util/error"

import redis from "../config/redis"

import { safeClean, safeSeed, expectQuizToEqual, configA } from "./util"

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

afterEach(async () => {
  await redis.client?.flushall()
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get("/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
      .expect(404)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
      .expect(404)
      .end(done)
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

describe("dashboard - quizzes: count answers requiring attention should", () => {
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/quizzes/44bf4cf2f-3058-4311-8d16-26d781261af7/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/count-answers-requiring-attention",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
  })

  test("respond with 404 if invalid quiz id", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af8"
    request(app.callback())
      .get(
        `/api/v2/dashboard/quizzes/${quizId}/count-answers-requiring-attention`,
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`quiz not found: ${quizId}`)
      })
      .expect(404)
      .end(done)
  })

  describe("on valid request:", () => {
    test("return 0 when none require attention", done => {
      request(app.callback())
        .get(
          "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/count-answers-requiring-attention",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .expect(200)
        .expect(response => {
          const received = response.body
          expect(received).toEqual({})
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 2345,
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
      })
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quizzes",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 2345,
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
      })
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
  })

  test("respond with 404 if invalid quiz id", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af8")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(404)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 2345,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer ADMIN_TOKEN") {
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send(input.newQuiz)
      .expect(403)
      .end(done)
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

  test("delete quiz peer review question", done => {
    let testInput = input.quizUpdate
    testInput.peerReviewCollections[0].questions = []
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(testInput)
      .expect(200)
      .expect(response => {
        const received = response.body
        expectQuizToEqual(received, validation.quizWithoutPeerReviewQuestions)
      })
      .end(done)
  })

  test("delete quiz peer review", done => {
    let testInput = input.quizUpdate
    testInput.peerReviewCollections = []
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(testInput)
      .expect(200)
      .expect(response => {
        const received = response.body
        expectQuizToEqual(received, validation.quizWithoutPeerReviews)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 5555,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer ADMIN_TOKEN") {
          return [
            200,
            {
              id: 999889,
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
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
  })

  test("get answer by id", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received = response.body
        expect(received).toStrictEqual(validation.quizAnswerValidator1)
      })
      .expect(200)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 1234,
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
      })
  })

  test("get answers by quiz id: page 1, filter confirmed", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=confirmed&notDeleted=true&deleted=true",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(20)
        expect(states.size).toBe(1)
        expect(states.has("confirmed")).toBe(true)
      })
      .expect(200)
      .end(done)
  })

  test("get answers by quiz id: page 2", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=deprecated&notDeleted=true&deleted=true",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(10)
        expect(states.size).toBe(1)
        expect(states.has("deprecated")).toBe(true)
      })
      .expect(200)
      .end(done)
  })

  test("get answers by quiz id: page 3, one status filter", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=manual-review&notDeleted=true&deleted=true",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(15)
        expect(states.size).toBe(1)
        expect(states.has("manual-review")).toBe(true)
      })
      .expect(200)
      .end(done)
  })

  test("get answers by quiz id: page 4, two status filter", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/all?page=0&size=20&order=asc&filters=manual-review,confirmed&notDeleted=true&deleted=true",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: QuizAnswer[] = response.body.results
        const states = new Set(received.map(answer => answer.status))
        expect(received).toHaveLength(20)
        expect(states.size).toBe(2)
        expect(states.has("deprecated")).toBe(false)
      })
      .expect(200)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 1234,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=0&size=10",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/answers/2a0c2270-011e-40b2-8796-625764828034/manual-review?page=0&size=10",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
      .expect(200)
      .end(done)
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
      .expect(200)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 2345,
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
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/status",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({ status: "confirmed" })
      .expect(403)
      .end(done)
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
      .expect(400)
      .end(done)
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
      .expect(200)
      .end(done)
  })
})

describe("Answer: spam flags", () => {
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
        if (auth === "Bearer PLEB_TOKEN_1") {
          return [
            200,
            {
              id: 1234,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer PLEB_TOKEN_2") {
          return [
            200,
            {
              id: 2345,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer PLEB_TOKEN_3") {
          return [
            200,
            {
              id: 3456,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer PLEB_TOKEN_4") {
          return [
            200,
            {
              id: 4567,
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
      })
  })

  test("spam flag already given", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/report-spam")
      .set("Authorization", "bearer PLEB_TOKEN_1")
      .set("Accept", "application/json")
      .send({
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      })
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Can only give one spam flag")
      })
      .expect(400)
      .end(done)
  })

  test("First spam flag", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/report-spam")
      .set("Authorization", "bearer PLEB_TOKEN_2")
      .set("Accept", "application/json")
      .send({
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      })
      .expect(res => {
        expect(res.body).toEqual(validation.spamFlagValidator1)
      })
      .expect(200)
      .end(done)
  })

  test("check the answers status", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        expect(response.body.status).toEqual("given-enough")
        expect(response.body.userQuizState.spamFlags).toEqual(1)
      })
      .expect(200)
      .end(done)
  })

  test("Second spam flag", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/report-spam")
      .set("Authorization", "bearer PLEB_TOKEN_3")
      .set("Accept", "application/json")
      .send({
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      })
      .expect(response => {
        expect(response.body).toEqual(validation.spamFlagValidator2)
      })
      .expect(200)
      .end(done)
  })

  test("check the answer status", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        expect(response.body.userQuizState.spamFlags).toEqual(2)
        expect(response.body.status).toEqual("given-enough")
      })
      .expect(200)
      .end(done)
  })

  test("Third spam flag", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/report-spam")
      .set("Authorization", "bearer PLEB_TOKEN_4")
      .set("Accept", "application/json")
      .send({
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      })
      .expect(response => {
        expect(response.body).toEqual(validation.spamFlagValidator3)
      })
      .expect(200)
      .end(done)
  })

  test("check the answer status", done => {
    request(app.callback())
      .get("/api/v2/dashboard/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c")
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        expect(response.body.userQuizState.spamFlags).toEqual(3)
        expect(response.body.status).toEqual("spam")
      })
      .expect(200)
      .end(done)
  })
})

describe("fetching user progress should", () => {
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 2345,
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
      })
  })
  test("return empty when user has no progress", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/current/progress",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual([])
      })
      .expect(200)
      .end(done)
  })

  test("return user's progress in correct shape when user has prgress", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/user/current/progress",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(validation.userProgressValidator)
      })
      .expect(200)
      .end(done)
  })

  test("throw if invalid course id provided", done => {
    const invalidCourseId = "7966ffd1-692b-41fd-974f-50a43173743c"
    request(app.callback())
      .get(`/api/v2/dashboard/courses/${invalidCourseId}/user/current/progress`)
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`course not found: ${invalidCourseId}`)
      })
      .expect(404)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/duplicate-course",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/duplicate-course",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
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
      .expect(404)
      .end(done)
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
        .expect(200)
        .end(done)
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
        .expect(200)
        .end(done)
    })
  })
})

//TODO: figure out how to parse the csv stream
describe("dashboard - courses: downloading a correspondence file should", () => {
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 6666,
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
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(403)
      .end(done)
  })

  //TODO: asserts on response
  test("should return 200 on successful request", done => {
    request(app.callback())
      .post("/api/v2/dashboard/courses/download-correspondence-file")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send(input.correspondenceIds)
      .expect(200)
      .end(done)
  })
})

describe("dashboard: fetching all exisiting languages", () => {
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
        if (auth === "Bearer ADMIN_TOKEN") {
          return [
            200,
            {
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  test("should return all languages on valid request", done => {
    request(app.callback())
      .get("/api/v2/dashboard/languages/all")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        expect(response.body).toStrictEqual(validation.allLanguages)
      })
      .expect(200)
      .end(done)
  })
})

describe("dashboard: an edit made to a course should", () => {
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
        if (auth === "Bearer ADMIN_TOKEN") {
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
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/edit",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with course that reflects edits", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/courses/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/edit",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send(input.editedCourse)
      .expect(response => {
        const course = response.body
        expect(course).toStrictEqual(validation.editedCourse)
      })
      .expect(200)
      .end(done)
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
        if (auth === "Bearer PLEB_TOKEN") {
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
      })
    request(app.callback())
      .get("/api/v2/dashboard/users/current/abilities")
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(userAbilities.abilities.teacher)
      })
      .expect(200)
      .end(done)
  })

  test("dashboard: get current user abilities, assistant", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 8765,
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
      })
    request(app.callback())
      .get("/api/v2/dashboard/users/current/abilities")
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(userAbilities.abilities.assistant)
      })
      .expect(200)
      .end(done)
  })
})

describe("dashboard: get user abilities for course", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async done => {
    nock.cleanAll()
    await safeClean()
    done()
  })

  test("get user abilities, assistant", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 8765,
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
      })
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/abilities",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(["view", "edit", "grade", "delete"])
      })
      .expect(200)
      .end(done)
  })

  test("get user abilities, reviewer", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 8765,
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
        if (auth === "Bearer REVIEWER_TOKEN") {
          return [
            200,
            {
              id: 2020,
              administrator: false,
            } as UserInfo,
          ]
        }
      })
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/abilities",
      )
      .set("Authorization", "bearer REVIEWER_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(["view", "grade"])
      })
      .expect(200)
      .end(done)
  })

  test("get user abilities, teacher", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
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
      })
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/abilities",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual(["view", "edit", "grade", "delete"])
      })
      .expect(200)
      .end(done)
  })

  test("get user abilities, admin", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer ADMIN_TOKEN") {
          return [
            200,
            {
              id: 9876,
              administrator: true,
            } as UserInfo,
          ]
        }
      })
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/abilities",
      )
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual([
          "view",
          "edit",
          "grade",
          "delete",
          "download",
          "duplicate",
        ])
      })
      .expect(200)
      .end(done)
  })

  test("get user abilities, no-body", done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 1234,
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
      })
    request(app.callback())
      .get(
        "/api/v2/dashboard/courses/51b66fc3-4da2-48aa-8eab-404370250ca3/user/abilities",
      )
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {
        expect(res.body).toEqual([])
      })
      .expect(200)
      .end(done)
  })
})

describe("dashboard: get quizzes answer statistics", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async done => {
    nock.cleanAll()
    await safeClean()
    done()
  })

  beforeEach(async () => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer INSUFFICIENT_TOKEN") {
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 1234,
              administrator: false,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/answerStatistics",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401, done)
  })

  test("respond with 401 if insufficient credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/answerStatistics",
      )
      .set("Authorization", `bearer INSUFFICIENT_TOKEN`)
      .expect(403, done)
  })

  test("respond with 200 on succesfull request", done => {
    request(app.callback())
      .get(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/answerStatistics",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(response => {
        let checked: string[] = []
        for (const key in response.body) {
          expect(key).toBeString()
          expect(possibleAnswerStates).toContain(key)
          expect(checked).not.toContain(key)
          checked.push(key)
          expect(response.body[key]).toBeNumber()
        }
      })
      .expect(200)
      .end(done)
  })
})

describe("dashboard: get all answer states", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async done => {
    nock.cleanAll()
    await safeClean()
    done()
  })

  beforeEach(async () => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer INSUFFICIENT_TOKEN") {
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
        if (auth === "Bearer PLEB_TOKEN") {
          return [
            200,
            {
              id: 1234,
              administrator: false,
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/answers/get-answer-states")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 200 with succesfull request", done => {
    request(app.callback())
      .get("/api/v2/dashboard/quizzes/answers/get-answer-states")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .expect(response => {
        const result: string[] = response.body.filter(
          (state: string) => !possibleAnswerStates.includes(state),
        )
        expect(result).toEqual([])
      })
      .expect(200)
      .end(done)
  })
})

import { BadRequestError } from "./../src/util/error"
import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { configA, safeClean, safeSeed } from "./util"
import { UserInfo } from "../src/types"

import redis from "../config/redis"

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

afterEach(async () => {
  await redis.client?.flushall()
})

describe("downloading info when redis unavailable", () => {
  const tmp = redis.client
  beforeEach(() => {
    redis.client = undefined
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer admin_token") {
          return [
            200,
            {
              administrator: true,
              username: "admin",
            } as UserInfo,
          ]
        }
      })
  })

  afterAll(async () => {
    redis.client = tmp
  })

  test("should throw a BadRequestError when token not generated on quiz info download", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
  test("should throw a BadRequestError when token not generated on peer review info download", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
  test("should throw a BadRequestError when token not generated on answer info download", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-answer-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
})

describe("dashboard - courses: downloading quiz info should", () => {
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
              username: "admin",
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("return 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a valid download url and username on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl, username } = response.body
        expect(username).toEqual("admin")
        expect(downloadUrl).toInclude(
          `/download/download-quiz-info/${quizId}?&downloadToken=`,
        )
      })
      .end(done)
  })
})

describe("dashboard: downloading peer review info should", () => {
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
              username: "admin",
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a valid download url and username on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl, username } = response.body
        expect(username).toEqual("admin")
        expect(downloadUrl).toInclude(
          `/download/download-peerreview-info/${quizId}?&downloadToken=`,
        )
      })
      .end(done)
  })
})

describe("dashboard: downloading answer info should", () => {
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
              username: "admin",
            } as UserInfo,
          ]
        }
      })
  })

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a valid download url and username on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-answer-info`)
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl, username } = response.body
        expect(username).toEqual("admin")
        expect(downloadUrl).toInclude(
          `/download/download-answer-info/${quizId}?&downloadToken=`,
        )
      })
      .end(done)
  })
})

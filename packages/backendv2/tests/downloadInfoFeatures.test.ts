import { BadRequestError } from "./../src/util/error"
import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { configA, safeClean, safeSeed } from "./util"
import { UserInfo } from "../src/types"

import redis from "../config/redis"

const checkTmcCredentials = () => {
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
            id: 2222,
            administrator: true,
          } as UserInfo,
        ]
      }
      if (auth === "Bearer ADMIN_TOKEN_NO_ID") {
        return [
          200,
          {
            administrator: true,
          } as UserInfo,
        ]
      }
    })
}

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.flushall()
  await redis.client?.quit()
})

describe("dashboard - courses: downloading quiz info should", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)

      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("return 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a valid download url on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl } = response.body
        const downloadToken = downloadUrl.substring(
          downloadUrl.lastIndexOf("=") + 1,
        )
        expect(downloadUrl).toInclude(
          `/download/download-quiz-info/${quizId}?&downloadToken=`,
        )
        expect(downloadToken)
      })
      .end(done)
  })

  describe("attempting to download with a download token", () => {
    test("should return csv content on success ", async done => {
      const downloadToken = await redis.client?.get("2222")

      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      request(app.callback())
        .post(
          `/api/v2/dashboard/quizzes/download/download-quiz-info/${quizId}?&downloadToken=${downloadToken}`,
        )
        .send({
          userId: 2222,
          quizName: "test",
          courseName: "test",
        })
        .expect("Content-Type", "text/csv; charset=utf-8")
        .expect(200)
        .end(done)
    })
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

  beforeEach(() => checkTmcCredentials())

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("respond with 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a valid download url on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl } = response.body
        const downloadToken = downloadUrl.substring(
          downloadUrl.lastIndexOf("=") + 1,
        )
        expect(downloadUrl).toInclude(
          `/download/download-peerreview-info/${quizId}?&downloadToken=`,
        )
        expect(downloadToken)
      })
      .end(done)
  })

  describe("attempting to download with a download token", () => {
    test("should return csv content on success ", async done => {
      const downloadToken = await redis.client?.get("2222")
      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      request(app.callback())
        .post(
          `/api/v2/dashboard/quizzes/download/download-peerreview-info/${quizId}?&downloadToken=${downloadToken}`,
        )
        .send({
          quizName: "test",
          courseName: "test",
          userId: 2222,
        })
        .expect("Content-Type", "text/csv; charset=utf-8")
        .expect(200)
        .end(done)
    })
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

  test("respond with 401 if invalid credentials", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("respond with 200 on successful request", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .end(done)
  })

  test("return a download url on successful request", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-answer-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect(response => {
        const { downloadUrl } = response.body
        const downloadToken = downloadUrl.substring(
          downloadUrl.lastIndexOf("=") + 1,
        )
        expect(downloadUrl).toInclude(
          `/download/download-answer-info/${quizId}?&downloadToken=`,
        )
        expect(downloadToken)
      })
      .end(done)
  })

  describe("attempting to download with a download token", () => {
    test("should return csv content on success ", async done => {
      const downloadToken = await redis.client?.get("2222")
      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      request(app.callback())
        .post(
          `/api/v2/dashboard/quizzes/download/download-answer-info/${quizId}?&downloadToken=${downloadToken}`,
        )
        .send({
          userId: "2222",
          quizName: "test",
          courseName: "test",
        })
        .expect("Content-Type", "text/csv; charset=utf-8")
        .expect(200)
        .end(done)
    })
  })
})

describe("downloading info in sequence", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("should work and use the same download token", async () => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
    let downloadUrl = ""
    let downloadTokenOnFirstCall = ""
    let downloadTokenOnSecondCall = ""

    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .send({
        courseId,
      })
      .expect(200)
      .expect(response => {
        downloadUrl = response.body.downloadUrl
        downloadTokenOnFirstCall = downloadUrl.substring(
          downloadUrl.lastIndexOf("=") + 1,
        )
      })
      .end()

    request(app.callback())
      .post(downloadUrl)
      .send({
        quizName: "test",
        courseName: "test",
        userId: 2222,
      })
      .expect("Content-Type", "text/csv; charset=utf-8")
      .expect(200)
      .end()

    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .send({
        courseId,
      })
      .expect(200)
      .expect(response => {
        downloadUrl = response.body.downloadUrl
        downloadTokenOnSecondCall = downloadUrl.substring(
          downloadUrl.lastIndexOf("=") + 1,
        )
      })
      .end()

    request(app.callback())
      .post(downloadUrl)
      .send({
        quizName: "test",
        courseName: "test",
        userId: 2222,
      })
      .expect("Content-Type", "text/csv; charset=utf-8")
      .expect(200)
      .end()

    expect(downloadTokenOnFirstCall).toEqual(downloadTokenOnSecondCall)
  })
})

describe("downloading info when redis unavailable", () => {
  const tmp = redis.client
  beforeEach(() => {
    redis.client = undefined
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function() {
        const auth = this.req.headers.authorization
        if (auth === "Bearer ADMIN_TOKEN") {
          return [
            200,
            {
              id: 6666,
              administrator: true,
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
      .set("Authorization", `Bearer ADMIN_TOKEN`)
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
      .set("Authorization", `Bearer ADMIN_TOKEN`)
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
      .set("Authorization", `Bearer ADMIN_TOKEN`)
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

import nock from "nock"
import request from "supertest"

import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { BadRequestError } from "./../src/util/error"
import { configA, safeClean, safeSeed } from "./util"

const checkTmcCredentials = () => {
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
      return [401]
    })
}

const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
const otherQuizId = "2a0c2270-011e-40b2-8796-625764828034"

const issueDownloadToken = async (kind: string) => {
  const response = await request(app.callback())
    .post(`/api/v2/dashboard/quizzes/${quizId}/download-${kind}`)
    .set("Authorization", `Bearer ADMIN_TOKEN`)
    .send({ courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b" })
    .expect(200)
  return new URL(
    response.body.downloadUrl,
    "http://localhost",
  ).searchParams.get("downloadToken")
}

const download = (kind: string, downloadToken: string, forQuizId = quizId) =>
  request(app.callback())
    .post(
      `/api/v2/dashboard/quizzes/download/download-${kind}/${forQuizId}?&downloadToken=${downloadToken}`,
    )
    .send({ userId: 2222, quizName: "test", courseName: "test" })

beforeAll(() => {
  nock.disableNetConnect()
  nock.enableNetConnect("127.0.0.1")
})

afterAll(async () => {
  nock.enableNetConnect()
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

  test("respond with 401 if invalid credentials", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-quiz-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)

      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("return 200 on successful request", (done) => {
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

  test("return a valid download url on successful request", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect((response) => {
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
    test("should return csv content on success ", async () => {
      const downloadToken = await issueDownloadToken("quiz-info")

      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      await request(app.callback())
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

  test("respond with 401 if invalid credentials", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-peerreview-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("respond with 200 on successful request", (done) => {
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

  test("return a valid download url on successful request", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect((response) => {
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
    test("should return csv content on success ", async () => {
      const downloadToken = await issueDownloadToken("peerreview-info")
      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      await request(app.callback())
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
    })
  })
})

describe("dashboard: downloading answer info should", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("respond with 401 if invalid credentials", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `Bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("respond with BadRequestError if user id not provided", (done) => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/download-answer-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN_NO_ID`)
      .expect(400)
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No user id provided.")
      })
      .end(done)
  })

  test("respond with 200 on successful request", (done) => {
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

  test("return a download url on successful request", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-answer-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(200)
      .expect((response) => {
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
    test("should return csv content on success ", async () => {
      const downloadToken = await issueDownloadToken("answer-info")
      const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
      await request(app.callback())
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
    })
  })
})

describe("download tokens", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    nock.cleanAll()
    await safeClean()
  })

  beforeEach(() => checkTmcCredentials())

  test("are single-use", async () => {
    const downloadToken = await issueDownloadToken("quiz-info")
    await download("quiz-info", downloadToken!).expect(200)
    await download("quiz-info", downloadToken!).expect(400)
  })

  test("only work for the quiz they were issued for", async () => {
    const downloadToken = await issueDownloadToken("quiz-info")
    await download("quiz-info", downloadToken!, otherQuizId).expect(400)
  })

  test("only work for the kind of download they were issued for", async () => {
    const downloadToken = await issueDownloadToken("quiz-info")
    await download("answer-info", downloadToken!).expect(400)
  })

  test("are not interchangeable with cached TMC users", async () => {
    await request(app.callback())
      .get("/api/v2/dashboard/users/current/abilities")
      .set("Authorization", `Bearer PLEB_TOKEN`)
    for (const kind of ["quiz-info", "peerreview-info", "answer-info"]) {
      await request(app.callback())
        .post(
          `/api/v2/dashboard/quizzes/download/download-${kind}/${quizId}?&downloadToken=${encodeURIComponent(
            JSON.stringify({ id: 6666, administrator: false }),
          )}`,
        )
        .send({ userId: "PLEB_TOKEN", quizName: "test", courseName: "test" })
        .expect(400)
    }
  })

  test("are not issued for an unknown quiz", async () => {
    await request(app.callback())
      .post(
        "/api/v2/dashboard/quizzes/00000000-0000-0000-0000-000000000000/download-quiz-info",
      )
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({ courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b" })
      .expect(404)
  })

  test("are not issued to non-admins", async () => {
    await request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `Bearer PLEB_TOKEN`)
      .send({ courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b" })
      .expect(403)
  })
})

describe("downloading info when redis unavailable", () => {
  const tmp = redis.client
  beforeEach(() => {
    redis.client = undefined
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(function () {
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
        return [401]
      })
  })

  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    redis.client = tmp
    await safeClean()
  })

  test("should throw a BadRequestError when token not generated on quiz info download", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
  test("should throw a BadRequestError when token not generated on peer review info download", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
  test("should throw a BadRequestError when token not generated on answer info download", (done) => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
    request(app.callback())
      .post(`/api/v2/dashboard/quizzes/${quizId}/download-answer-info`)
      .set("Authorization", `Bearer ADMIN_TOKEN`)
      .send({
        courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      })
      .expect(400)
      .expect((response) => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("Failed to generate download token.")
      })
      .end(done)
  })
})

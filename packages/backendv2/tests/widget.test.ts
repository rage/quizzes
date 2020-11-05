import request from "supertest"
import { v4 as uuidv4 } from "uuid"
import nock from "nock"
const knexCleaner = require("knex-cleaner")
import app from "../app"
import knex from "../database/knex"
import { input, validation } from "./data"
import { UserInfo } from "../src/types"
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../src/util/error"

import { safeClean, safeSeed, configA } from "./util"

afterAll(async () => {
  return knex.destroy()
})

describe("widget: save quiz answer", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
    })
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
      .end(done)
  })
})

describe("widget: a fetch for peer reviews for some quiz answer...", () => {
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

  test("responds with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/peer-reviews",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(response => {
        const received: UnauthorizedError = response.body
        expect(received.message).toEqual("unauthorized")
      })
      .expect(401, done)
  })

  test("responds with 404 if invalid answer id", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/1cb3e4de-fc11-4aac-be45-06312aa4677c/peer-reviews",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(
          "quiz answer not found: 1cb3e4de-fc11-4aac-be45-06312aa4677c",
        )
      })
      .expect(404, done)
  })
})

describe("on a valid request", () => {
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
  test("returns an empty array if no peer reviews received", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/ae29c3be-b5b6-4901-8588-5b0e88774748/peer-reviews",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        expect(response.body).toEqual([])
      })
      .expect(200, done)
  })

  test("returns correct number of peer reviews on valid request", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/peer-reviews",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        expect(response.body.length).toEqual(2)
      })
      .expect(200, done)
  })
  test("returns peer reviews that are of correct shape", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/0cb3e4de-fc11-4aac-be45-06312aa4677c/peer-reviews",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(response => {
        expect(response.body).toStrictEqual(
          validation.receivedPeerReviewsValidator,
        )
      })
      .expect(200, done)
  })
})

describe("widget: submitting a peer review", () => {
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
        if (auth === "Bearer pleb_token_1") {
          return [
            200,
            {
              id: 4321,
              administrator: false,
            } as UserInfo,
          ]
        }
        if (auth === "Bearer pleb_token_2") {
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

  test("responds with 401 if invalid credentials", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(response => {
        const received: UnauthorizedError = response.body
        expect(received.message).toEqual("unauthorized")
      })
      .expect(401, done)
  })

  test("responds with 404 if invalid answer id", done => {
    const randomUuid = uuidv4()
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({
        ...input.peerReview1,
        quizAnswerId: randomUuid,
      })
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`quiz answer not found: ${randomUuid}`)
      })
      .expect(404, done)
  })

  test("throws when peer review answer contains no text or value", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .send({
        ...input.peerReview1,
        answers: [
          {
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: null,
          },
        ],
      })
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual(`review must contain values`)
      })
      .expect(400, done)
  })
  test("throws when user quiz state not found", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_1`)
      .set("Accept", "application/json")
      .send(input.peerReview3)
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`User quiz state not found.`)
      })
      .expect(404, done)
  })

  test("returns peer review in correct shape when request successful", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_2`)
      .set("Accept", "application/json")
      .send(input.peerReview2)
      .expect(200)
      .expect(response => {
        const {
          userQuizState: { peerReviewsGiven },
        } = response.body
        expect(peerReviewsGiven).toEqual(1)
        expect(response.body).toStrictEqual(
          validation.givenPeerReviewsValidator[0],
        )
      })
      .end(done)
  })
  test("throws if user reviewing their own answer", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_2`)
      .set("Accept", "application/json")
      .send(input.peerReview1)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual(`User cannot review their own answer`)
      })
      .expect(400, done)
  })

  test("does not allow the same answer to be reviewed twice by the same user", done => {
    request(app.callback())
      .post("/api/v2/widget/answers/give-review")
      .set("Authorization", `bearer PLEB_TOKEN_2`)
      .set("Accept", "application/json")
      .send(input.peerReview2)
      .expect(400)
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual(
          `Answer can only be peer reviewed once`,
        )
      })
      .end(done)
  })
})

describe("widget: fetching quiz info", () => {
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

  test("responds with 401 if invalid credentials", done => {
    request(app.callback())
      .get("/api/v2/widget/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(response => {
        const received: UnauthorizedError = response.body
        expect(received.message).toEqual("unauthorized")
      })
      .expect(401, done)
  })

  test("should throw with 404 if invalid quiz id", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af6"
    request(app.callback())
      .get(`/api/v2/widget/quizzes/${quizId}`)
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`quiz not found: ${quizId}`)
      })
      .expect(404, done)
  })

  //TODO: validate the returned quiz when sure what it should return
  test("as admin should return quiz with all info when valid quiz id provided", done => {
    request(app.callback())
      .get("/api/v2/widget/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7")
      .set("Authorization", "bearer ADMIN_TOKEN")
      .set("Accept", "application/json")
      .expect(res => {})
      .expect(200, done)
  })
})

describe("widget: fetching peer review candidates", () => {
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

  test("responds with 401 if invalid credentials", done => {
    request(app.callback())
      .get(
        "/api/v2/widget/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/get-candidates",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(response => {
        const received: UnauthorizedError = response.body
        expect(received.message).toEqual("unauthorized")
      })
      .expect(401, done)
  })

  test("should throw with 404 if invalid quiz id", done => {
    const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af6"
    request(app.callback())
      .get(`/api/v2/widget/answers/${quizId}/get-candidates`)
      .set("Authorization", "bearer PLEB_TOKEN")
      .set("Accept", "application/json")
      .expect(response => {
        const received: NotFoundError = response.body
        expect(received.message).toEqual(`quiz not found: ${quizId}`)
      })
      .expect(404, done)
  })

  describe("on successful request", () => {
    test("returns correct number of candidates", done => {
      request(app.callback())
        .get(
          "/api/v2/widget/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/get-candidates",
        )
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .expect(res => {
          console.log("💩: res", res.body)
          expect(res.body.length).toEqual(1)
        })
        .expect(200, done)
    })
    test("returns candidates for review in correct shape", done => {
      request(app.callback())
        .get(
          "/api/v2/widget/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/get-candidates",
        )
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .expect(res => {
          expect(res.body[0]).toStrictEqual(validation.quizAnswerValidator2)
        })
        .expect(200, done)
    })
  })
})

import { BadRequestError } from "./../src/util/error"
import nock from "nock"
import request from "supertest"
import app from "../app"
import knex from "../database/knex"
import { Model, snakeCaseMappers } from "objection"

import { UserInfo } from "../src/types"

const knexCleaner = require("knex-cleaner")

const safeClean = async () => {
  if (process.env.NODE_ENV === "test") {
    return await knexCleaner.clean(knex)
  }
}

const safeSeed = async (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    await knex.seed.run(config)
  }
}

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

describe("dashboard: searching for all answers based on text content should", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
    })
  })

  afterAll(async () => {
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
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .expect(403, done)
  })

  test("throw bad request if no search query provided", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No search query provided.")
      })
      .expect(400, done)
  })

  describe("on successful search", () => {
    test("return 200", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all?page=0",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "blaadi blaa" })
        .expect(200, done)
    })

    test("return 3 answers when 3 answers match search query", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all?page=0",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "blaadi blaa" })
        .expect(response => {
          expect(response.body.total).toEqual(3)
        })
        .expect(200, done)
    })

    test("return 0 answers when no content matching search query ", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/all?page=0",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "king of kings" })
        .expect(response => {
          expect(response.body.total).toEqual(0)
        })
        .expect(200, done)
    })
  })
})

describe("dashboard: searching for manual review answers based on text content should", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
    })
  })

  afterAll(async () => {
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
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .set("Accept", "application/json")
      .expect(401, done)
  })

  test("respond with 403 if insufficient privilege", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
      )
      .set("Authorization", `bearer PLEB_TOKEN`)
      .set("Accept", "application/json")
      .expect(403, done)
  })

  test("throw bad request if no search query provided", done => {
    request(app.callback())
      .post(
        "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .expect(response => {
        const received: BadRequestError = response.body
        expect(received.message).toEqual("No search query provided.")
      })
      .expect(400, done)
  })

  describe("on successful search", () => {
    test("return 200", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "test" })
        .expect(response => {
          console.log(response.body)
        })
        .expect(200, done)
    })

    test("return 0 matches when non exist", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "blaadi blaa" })
        .expect(response => {
          expect(response.body.total).toEqual(0)
        })
        .expect(200, done)
    })

    test("return 1 answer requiring manual review when only 1 matches the query", done => {
      request(app.callback())
        .post(
          "/api/v2/dashboard/answers/4bf4cf2f-3058-4311-8d16-26d781261af7/manual-review",
        )
        .set("Authorization", `bearer ADMIN_TOKEN`)
        .set("Accept", "application/json")
        .send({ searchQuery: "linked to" })
        .expect(response => {
          expect(response.body.total).toEqual(1)
        })
        .expect(200, done)
    })
  })
})

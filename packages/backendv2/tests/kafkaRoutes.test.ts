import nock from "nock"
import { Model, snakeCaseMappers } from "objection"
import redis from "../config/redis"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { safeSeed, safeClean } from "./util"
import request from "supertest"
import app from "../app"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

describe("kafka routes tests", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "kafkaMessage.ts",
    })
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

  test("response with 401 if PLEB_TOKEN", async () => {
    const response = await request(app.callback())
      .get("/api/v2/kafka/healthz")
      .set("Authorization", `bearer BAD_TOKEN`)

    expect(response.status).toEqual(401)
  })

  test("response with 200 if messages less than 1000", async () => {
    const response = await request(app.callback())
      .get("/api/v2/kafka/healthz")
      .set("Authorization", `bearer ADMIN_TOKEN`)

    expect(response.status).toEqual(200)
  })

  describe("Too many kafka messages", () => {
    beforeAll(async () => {
      await safeSeed({
        directory: "./database/seeds",
        specific: "tooManyKafkaMessages.ts",
      })
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

    test("respond with 500 if over 1000 messages", async () => {
      const response = await request(app.callback())
        .get("/api/v2/kafka/healthz")
        .set("Authorization", `bearer ADMIN_TOKEN`)

      expect(response.status).toEqual(500)
    })
  })
})

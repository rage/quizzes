import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"

import redis from "../config/redis"
import { safeClean, safeSeed, configA } from "./util"

afterAll(async () => {
    await knex.destroy()
    await redis.client?.flushall()
})

afterEach(async () => {
    await redis.client?.flushall()
})

describe("general: course progress", () => {
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
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/progress",
      )
      .set("Authorization", `bearer BAD_TOKEN`)
      .expect(401)
      .end(done)
  })

  test("returns quiz titles on request", done => {
    request(app.callback())
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quiz-titles"
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(200)
      .end(done)
  })

  test("returns course progress on request", done => {
    request(app.callback())
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/progress"
      )
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .expect(200)
      .end(done)
  })
})
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
  await redis.client?.quit()
})

afterEach(async () => {
  await redis.client?.flushall()
})

describe("general-api", () => {
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
              id: 1234,
              administrator: true,
            } as UserInfo,
          ]
        }
      })
  })

  it("returns quiz titles of specified course", done => {
    request(app.callback())
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/quiz-titles",
      )
      .set("Authorization", "bearer ADMIN_TOKEN")
      .expect(200)
      .expect(response => {
        const data = response.body
        expect(data["4bf4cf2f-3058-4311-8d16-26d781261af7"]).toEqual("quiz 1")
      })
      .end(done)
  })

  it("progress api doesn't allow unauthorized access", done => {
    request(app.callback())
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/progress",
      )
      .set("Authorization", "bearer BAD_TOKEN")
      .expect(401)
      .end(done)
  })

  it("progress api returns an array", done => {
    request(app.callback())
      .get(
        "/api/v2/general/course/46d7ceca-e1ed-508b-91b5-3cc8385fa44b/progress",
      )
      .set("Authorization", "bearer ADMIN_TOKEN")
      .expect(200)
      .expect(response => {
        const data = response.body
        expect(data).toBeArray()
        expect(data.length).toBe(1)
        // Check element of array
        const progress = data[0]
        expect(progress).toBeObject()
        expect(progress).toContainAllKeys([
          "group",
          "progress",
          "n_points",
          "max_points"
        ])
      })
      .end(done)
  })
})

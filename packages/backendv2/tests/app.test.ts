import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"

const knexCleaner = require("knex-cleaner")

beforeEach(async () => {
  await knex.seed.run()
})

afterEach(async () => {
  await knexCleaner.clean(knex)
  await knex.destroy()
})

describe("saving quiz from dashboard", () => {
  test("test", async done => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(200, {
        administrator: true,
      } as UserInfo)
    const response: any = request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({
        id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        course_id: "21356a26-7508-4705-9bab-39b239862632",
        part: 1,
        section: 1,
        points: 1,
        deadline: null,
        open: null,
        excluded_from_score: false,
        created_at: "2018-05-04 10:57:33.447000",
        updated_at: "2020-03-09 14:57:00.477000",
        auto_confirm: true,
        tries: 1,
        tries_limited: true,
        award_points_even_if_wrong: false,
        grant_points_policy: "grant_whenever_possible",
        auto_reject: true,
      })
      .end(done)
    console.log(response.status)
  })
})

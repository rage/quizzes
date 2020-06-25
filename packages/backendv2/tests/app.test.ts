import request from "supertest"
import nock from "nock"
import app from "../app"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import data from "./data"

const knexCleaner = require("knex-cleaner")

beforeEach(async () => {
  await knex.seed.run()
})

afterEach(async () => {
  await knexCleaner.clean(knex)
})

afterAll(async () => {
  await knex.destroy()
})

describe("saving quiz from dashboard", () => {
  beforeEach(async () => {
    nock("https://tmc.mooc.fi")
      .get("/api/v8/users/current?show_user_fields=true")
      .reply(200, {
        administrator: true,
      } as UserInfo)
  })

  test("respond with error if required field missing", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send({ ...data.newQuiz, part: null })
      .expect(500, done)
  })

  test("save valid quiz", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(data.newQuiz)
      .expect(200)
      .expect(response => {
        const returned = response.body
        expect(returned).toStrictEqual(data.newQuizValidator)
      })
      .end(done)
  })
  test("update existing quiz", async done => {
    request(app.callback())
      .post("/api/v2/dashboard/quizzes")
      .set("Authorization", `bearer ADMIN_TOKEN`)
      .set("Accept", "application/json")
      .send(data.quizUpdate)
      .expect(200)
      .expect(response => {
        const returned = response.body
        expect(returned).toStrictEqual(data.quizUpdateValidator)
      })
      .end(done)
  })
})

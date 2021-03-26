import { Model, snakeCaseMappers } from "objection"
import redis from "../config/redis"
import knex from "../database/knex"
import UserCoursePartState from "../src/models/user_course_part_state"
import { safeClean, safeSeed, configA } from "./util"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})
describe("test", () => {
  beforeAll(async () => {
    await safeSeed(configA)
  })

  afterAll(async () => {
    await safeClean()
  })
  test("correct progress", async () => {
    await knex.transaction(async trx => {
      const result = await UserCoursePartState.getProgress(
        2345,
        "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        trx,
      )

      expect(typeof result[0].n_points).toEqual("number")
    })
  })
})

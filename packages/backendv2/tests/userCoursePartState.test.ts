import { Model, snakeCaseMappers } from "objection"
import knex from "../database/knex"
import UserCoursePartState from "../src/models/user_course_part_state"

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
  test("correct progress", async () => {
    await knex.transaction(async trx => {
      const result = await UserCoursePartState.getProgress()
    })
  })
})

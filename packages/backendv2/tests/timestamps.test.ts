import { Model, snakeCaseMappers } from "objection"

import redis from "../config/redis"
import knex from "../database/knex"
import { Quiz, UserQuizState } from "../src/models"
import { configA, safeClean, safeSeed } from "./util"

const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"
const originalTimeZone = process.env.TZ

beforeAll(async () => {
  // Any zone with a non-zero offset exposes timestamps parsed as local time.
  process.env.TZ = "Europe/Helsinki"
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
  await safeSeed(configA)
})

afterAll(async () => {
  process.env.TZ = originalTimeZone
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

const storedDeadline = async () =>
  (
    await knex.raw<{ rows: { deadline: string }[] }>(
      "select deadline::text from quiz where id = ?",
      [quizId],
    )
  ).rows[0].deadline

describe("timestamp without time zone columns should", () => {
  test("be read as UTC", async () => {
    await knex.raw(
      "update user_quiz_state set created_at = '2020-01-01 12:00:00' where quiz_id = ?",
      [quizId],
    )
    const [userQuizState] = await UserQuizState.query().where("quiz_id", quizId)

    expect(new Date(userQuizState.createdAt).toISOString()).toEqual(
      "2020-01-01T12:00:00.000Z",
    )
  })

  test("store a Date as UTC", async () => {
    await Quiz.query()
      .patch({ deadline: new Date("2030-01-01T12:00:00.000Z") })
      .where("id", quizId)

    expect(await storedDeadline()).toEqual("2030-01-01 12:00:00")
  })

  test("store an ISO string with an offset as UTC", async () => {
    await Quiz.query()
      .patch({ deadline: "2030-01-01T14:00:00.000+02:00" as unknown as Date })
      .where("id", quizId)

    expect(await storedDeadline()).toEqual("2030-01-01 12:00:00")
    const quiz = await Quiz.query().findById(quizId).throwIfNotFound()
    expect(quiz.deadline?.toISOString()).toEqual("2030-01-01T12:00:00.000Z")
  })
})

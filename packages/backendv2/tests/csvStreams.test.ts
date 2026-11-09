import type { Readable } from "stream"

import redis from "../config/redis"
import knex, { setUpDB } from "../database/knex"
import { Course, Quiz } from "../src/models"
import { BadRequestError } from "../src/util/error"
import { configA, safeClean, safeSeed } from "./util"

const courseId = "46d7ceca-e1ed-508b-91b5-3cc8385fa44b"
const quizId = "4bf4cf2f-3058-4311-8d16-26d781261af7"

const readAll = (stream: Readable) =>
  new Promise<string>((resolve, reject) => {
    let csv = ""
    stream.on("data", (chunk) => (csv += chunk))
    stream.on("end", () => resolve(csv))
    stream.on("error", reject)
  })

beforeAll(async () => {
  setUpDB()
  await safeSeed(configA)
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

describe("CSV downloads", () => {
  test.each([
    ["quiz info", () => Quiz.getQuizInfo("not-a-uuid")],
    ["peer review info", () => Quiz.getPeerReviewInfo("not-a-uuid")],
    ["answer info", () => Quiz.getQuizAnswerInfo("not-a-uuid")],
    [
      "correspondence file",
      () => Course.getCorrespondenceFile(courseId, "not-a-uuid"),
    ],
  ])("reject a non-UUID id for %s", async (_name, download) => {
    await expect(download()).rejects.toBeInstanceOf(BadRequestError)
  })

  test("emit a failing query's error on the returned stream", async () => {
    const query = Quiz.query.bind(Quiz)
    jest
      .spyOn(Quiz, "query")
      .mockImplementation(() => query().whereRaw("1 / 0 = 1"))
    const failing = await Quiz.getQuizInfo(quizId)
    jest.restoreAllMocks()

    await expect(readAll(failing)).rejects.toThrow(/division by zero/)

    const csv = await readAll(await Quiz.getQuizInfo(quizId))
    expect(csv).toContain(quizId)
  })

  test("prefix formula-like text with an apostrophe and leave numbers intact", async () => {
    await knex("quiz_answer")
      .where("quiz_id", quizId)
      .update({ correctness_coefficient: -1 })
    await knex("quiz_item_answer")
      .whereIn(
        "quiz_answer_id",
        knex("quiz_answer").where("quiz_id", quizId).select("id"),
      )
      .update({ text_data: "=1+1" })

    const csv = await readAll(await Quiz.getQuizAnswerInfo(quizId))
    expect(csv).toContain('"\'=1+1"')
    expect(csv).not.toContain('"=1+1"')
    expect(csv).toContain('"-1"')
  })
})

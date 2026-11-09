import { Model, snakeCaseMappers } from "objection"

import redis from "../config/redis"
import knex from "../database/knex"
import { KafkaMessage, Quiz, QuizAnswer, UserQuizState } from "../src/models"
import { broadcastQuizAnswerUpdated } from "../src/services/kafka"
import { QuizAnswerMessage, RequiredAction } from "../src/types"
import { safeClean } from "./util"

const courseId = "0c0ad7b4-7a3c-4f1d-9c84-1d8b8a4b2f10"
const quizId = "5c8e07e2-0a3e-4d6b-9a8c-6f0f6d6b1a20"
const answerId = "8f1f5a7e-3d3c-4b9e-8d2a-2c4c9a1e7b30"
const userId = 5555

beforeAll(async () => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
  await safeClean()
  await knex("language").insert({ id: "xx_XX", country: "c", name: "l" })
  await knex("course").insert({
    id: courseId,
    moocfi_id: "e2f6c5a4-1b2c-4d3e-8f9a-0b1c2d3e4f50",
    min_peer_reviews_given: 2,
    min_peer_reviews_received: 2,
  })
  await knex("course_translation").insert({
    course_id: courseId,
    language_id: "xx_XX",
    abbreviation: "",
    title: "",
    body: "",
  })
  await knex("quiz").insert({
    id: quizId,
    course_id: courseId,
    part: 1,
    points: 1,
    tries: 1,
  })
  // The essay is deliberately not the first item.
  await knex("quiz_item").insert([
    { quiz_id: quizId, type: "multiple-choice", order: 0 },
    { quiz_id: quizId, type: "essay", order: 1 },
  ])
  await knex("user").insert({ id: userId })
  await knex("quiz_answer").insert({
    id: answerId,
    quiz_id: quizId,
    user_id: userId,
    language_id: "xx_XX",
    status: "confirmed",
  })
  await knex("user_quiz_state").insert({
    user_id: userId,
    quiz_id: quizId,
    tries: 1,
    peer_reviews_given: 1,
    peer_reviews_received: 2,
    points_awarded: 1,
  })
})

afterEach(async () => {
  await KafkaMessage.query().delete()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

const publishedMessages = async (): Promise<QuizAnswerMessage[]> =>
  (await KafkaMessage.query().where("topic", "user-points-realtime")).map(
    (row) => JSON.parse(row.message),
  )

describe("realtime quiz answer message should", () => {
  test("require only the missing peer reviews for a quiz with an essay item", async () => {
    await knex.transaction(async (trx) => {
      const quiz = await Quiz.query(trx).findById(quizId).throwIfNotFound()
      const quizAnswer = await QuizAnswer.query(trx)
        .findById(answerId)
        .throwIfNotFound()
      const userQuizState = await UserQuizState.query(trx)
        .findById([userId, quizId])
        .throwIfNotFound()
      await broadcastQuizAnswerUpdated(quizAnswer, userQuizState, quiz, trx)
    })

    const [message] = await publishedMessages()
    expect(message.required_actions).toEqual([RequiredAction.GIVE_PEER_REVIEW])
    expect(message.attempted).toEqual(true)
    expect(message.completed).toEqual(true)
  })

  test("report the quiz as unattempted after its last answer is deleted", async () => {
    await QuizAnswer.deleteAnswer(answerId)

    const [message] = await publishedMessages()
    expect(message.attempted).toEqual(false)
    expect(message.completed).toEqual(false)
    expect(message.n_points).toEqual(0)
    expect(message.required_actions).toEqual([])
    expect(message.original_submission_date).toBeNull()
  })
})

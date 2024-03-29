import { Model, snakeCaseMappers } from "objection"
import redis from "../config/redis"
import knex from "../database/knex"
import { KafkaMessage } from "../src/models"
import { safeClean, safeSeed } from "./util"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

describe("Kafka message", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "kafkaMessage.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  test("correct kafka message count, default topic", async () => {
    const result = await KafkaMessage.getCurrentCountByTopic()
    expect(result).toEqual(3)
  })

  test("correct kafka message count, different topic", async () => {
    const result = await KafkaMessage.getCurrentCountByTopic("something-else")
    expect(result).toEqual(1)
  })

  test("deletes kafka messages", async () => {
    const messagesBeforeDeletion = await KafkaMessage.fetchSomeMessage(100)
    const countBeforeDeletion = messagesBeforeDeletion.length
    await KafkaMessage.batchDelete(messagesBeforeDeletion)
    const messagesAfterDeletion = await KafkaMessage.fetchSomeMessage(100)
    const countAfterDeletion = messagesAfterDeletion.length

    expect(countBeforeDeletion).toEqual(4)
    expect(countAfterDeletion).toEqual(0)
  })
})

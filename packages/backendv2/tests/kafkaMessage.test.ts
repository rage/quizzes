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

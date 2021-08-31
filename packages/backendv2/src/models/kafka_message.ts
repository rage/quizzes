import Knex from "knex"
import { ModelObject } from "objection"
import { ProgressMessage, QuizAnswerMessage, QuizMessage } from "../types"
import BaseModel from "./base_model"

class KafkaMessage extends BaseModel {
  id!: string
  topic!: string
  message!: string
  createdAt!: string

  static get tableName() {
    return "kafka_message"
  }

  public static async createMessageEntry(
    topic: string,
    message: ProgressMessage | QuizAnswerMessage | QuizMessage,
    trx: Knex.Transaction,
  ) {
    return await this.query(trx).insertGraphAndFetch({
      topic: topic,
      message: JSON.stringify(message),
    })
  }

  public static async fetchSomeMessage(amount: number) {
    return await this.query()
      .select("*")
      .limit(amount)
  }

  public static async batchDelete(messages: KafkaMessage[]) {
    return await this.query()
      .whereIn(
        "id",
        messages.map(msg => msg.id),
      )
      .delete()
  }

  public static async getCurrentCountByTopic(topic = "user-points-realtime") {
    return this.query()
      .where({ topic })
      .resultSize()
  }
}

export type KafkaMessageType = ModelObject<KafkaMessage>

export default KafkaMessage

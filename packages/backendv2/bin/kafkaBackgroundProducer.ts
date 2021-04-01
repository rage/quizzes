import * as Kafka from "node-rdkafka"
import { promisify } from "util"
import { KafkaMessage } from "../src/models"
import { setUpDB } from "../database/knex"
import { GlobalLogger } from "../src/middleware/logger"

let producer: Kafka.Producer
let flush: any

setUpDB()

const sleep = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const connect = () => {
  return new Promise((resolve, reject) => {
    producer.connect({}, (err: Kafka.LibrdKafkaError, data: Kafka.Metadata) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const produce = async (topic: string, message: string) => {
  try {
    if (!producer) {
      producer = new Kafka.Producer({
        "metadata.broker.list": process.env.KAFKA_HOST || "localhost:9092",
        dr_cb: false,
      })
      await connect()
      flush = promisify(producer.flush.bind(producer))
    }
    producer.produce(topic, null, Buffer.from(message))
  } catch (error) {
    throw new Error(error)
  }
}

export const kafkaBackgroundMessageProducer = async () => {
  if (!process.env.KAFKA_HOST) {
    GlobalLogger.error("No kafka host defined")
    process.exit(-1)
  }
  GlobalLogger.info("Starting...")
  while (true) {
    try {
      const messages = await KafkaMessage.fetchSomeMessage(100)
      if (messages.length > 0) {
        GlobalLogger.info(`Producing ${messages.length} messages`)
        for (const msg of messages) {
          await produce(msg.topic, msg.message)
        }
        GlobalLogger.info("Message production completed")
        try {
          await flush(10000)
        } catch (e) {
          try {
            await flush(100000)
          } catch (e) {
            console.error("Unable to flush produced messages")
            process.exit(-1)
          }
        }

        GlobalLogger.info("deleting", messages.length, " messages")
        await KafkaMessage.batchDelete(messages)
        GlobalLogger.info("Messages deleted succesfully")
      }
    } catch (error) {
      GlobalLogger.error(error)
    }
    await sleep(10)
  }
}

kafkaBackgroundMessageProducer()

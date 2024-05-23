import * as Kafka from "node-rdkafka"
import { promisify } from "util"
import { KafkaMessage } from "../src/models"
import { setUpDB } from "../database/knex"
import { GlobalLogger } from "../src/middleware/logger"

const sleep = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const produce = async (
  producer: Kafka.Producer,
  topic: string,
  message: string,
) => {
  try {
    producer.produce(topic, null, Buffer.from(message))
  } catch (error) {
    throw new Error(error)
  }
}

const flush = async (flush: any) => {
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
        const topics = [...new Set(messages.map(msg => msg.topic))]
        GlobalLogger.info(`Producing ${messages.length} messages`)
        GlobalLogger.info(`Topics: ${topics}`)
        GlobalLogger.info(`Timestamp: ${messages[0].createdAt}`)
        for (const msg of messages) {
          await produce(producer, msg.topic, msg.message)
        }
        GlobalLogger.info("Message production completed")

        await flush(flusher)

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
setUpDB()

const producer = new Kafka.Producer({
  "metadata.broker.list": process.env.KAFKA_HOST || "localhost:9092",
  dr_cb: false,
  "security.protocol": "ssl",
  "enable.ssl.certificate.verification": false,
})

const flusher = promisify(producer.flush.bind(producer))

producer.connect({}, (err: Kafka.LibrdKafkaError, data: Kafka.Metadata) => {
  if (err) {
    GlobalLogger.error(err)
    return
  }
  GlobalLogger.info(`Connected ${data}`)
})

producer.on("ready", async () => {
  await kafkaBackgroundMessageProducer()
})

producer.on("connection.failure", (err: any, metrics: any) => {
  GlobalLogger.error(err)
  GlobalLogger.info(metrics)
  GlobalLogger.info("restarting...")
  //restarting pod
  process.exit(-1)
})

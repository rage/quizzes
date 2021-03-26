import * as Kafka from "node-rdkafka"
import { promisify } from "util"
import { KafkaMessage } from "../src/models"
import { setUpDB } from "../database/knex"

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
    console.error("No kafka host defined")
    process.exit(-1)
  }
  console.log("Starting...")
  while (true) {
    try {
      const messages = await KafkaMessage.fetchSomeMessage(100)
      console.log("Producing", messages.length, " messages")
      for (const msg of messages) {
        await produce(msg.topic, msg.message)
      }
      console.log("Message production completed")
      await flush(1000)
      console.log("deleting", messages.length, " messages")
      await KafkaMessage.batchDelete(messages)
      console.log("Messages deleted succesfully")
    } catch (error) {
      console.error(error)
    }
    await sleep(10)
  }
}

kafkaBackgroundMessageProducer()
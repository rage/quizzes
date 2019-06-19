import { Service } from "typedi"
import { Message, PointsByGroup } from "../types"

// tslint:disable-next-line:no-var-requires
const Kafka = require("node-rdkafka")

@Service()
export default class KafkaService {
  private stream = Kafka.Producer.createWriteStream(
    {
      "metadata.broker.list": process.env.KAFKA_URI,
    },
    {},
    {
      topic: process.env.KAFKA_TOPIC,
    },
  )

  public sendMessage(
    userId: number,
    courseId: string,
    progress: PointsByGroup[],
  ) {
    const message: Message = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      course_id: courseId,
      service_id: process.env.SERVICE_ID,
      progress,
    }
    this.stream.write(Buffer.from(JSON.stringify(message)))
  }
}

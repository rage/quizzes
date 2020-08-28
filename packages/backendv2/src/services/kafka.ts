import Knex from "knex"
import * as Kafka from "node-rdkafka"
import { promisify } from "util"
import {
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
  RequiredAction,
} from "../types"
import { Course, Quiz, QuizAnswer, UserQuizState } from "../models"
import UserCoursePartState from "../models/user_course_part_state"

let producer: Kafka.Producer
let flush: any

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

const produce = async (
  topic: "user-course-progress" | "user-points-2" | "exercise",
  message: ProgressMessage | QuizAnswerMessage | QuizMessage,
) => {
  if ((process.env.NODE_ENV = "test")) {
    return
  }
  try {
    if (!producer) {
      producer = new Kafka.Producer({
        "metadata.broker.list": process.env.KAFKA_HOST || "localhost:9092",
        dr_cb: false,
      })
      await connect()
      flush = promisify(producer.flush.bind(producer))
    }
    producer.produce(topic, null, Buffer.from(JSON.stringify(message)))
    await flush(1000)
  } catch (error) {
    console.log("producer failed")
  }
}

export const broadcastUserProgressUpdated = async (
  userId: number,
  courseId: string,
  trx: Knex.Transaction,
) => {
  const course = await Course.query(trx).findById(courseId)

  const progress = await UserCoursePartState.getProgress(userId, courseId, trx)
  const message: ProgressMessage = {
    timestamp: new Date().toISOString(),
    user_id: userId,
    course_id: course.moocfiId,
    service_id: process.env.SERVICE_ID || "",
    progress,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
  }

  if (course.moocfiId) {
    await produce("user-course-progress", message)
  }
}

export const broadcastQuizAnswerUpdated = async (
  quizAnswer: QuizAnswer,
  userQuizState: UserQuizState,
  quiz: Quiz,
  trx: Knex.Transaction,
) => {
  const messages: RequiredAction[] = []
  const course = await quiz.$relatedQuery("course", trx)
  const items = await quiz.$relatedQuery("items", trx)

  if (quizAnswer.status === "rejected" || quizAnswer.status === "spam") {
    messages.push(RequiredAction.REJECTED)
  } else if (items[0].type === "essay") {
    if (userQuizState.peerReviewsGiven < course.minPeerReviewsGiven) {
      messages.push(RequiredAction.GIVE_PEER_REVIEW)
    }
    if (userQuizState.peerReviewsReceived < course.minPeerReviewsReceived) {
      messages.push(RequiredAction.PENDING_PEER_REVIEW)
    }
  }

  const message: QuizAnswerMessage = {
    timestamp: new Date().toISOString(),
    exercise_id: quizAnswer.quizId,
    n_points: quiz.excludedFromScore ? 0 : userQuizState.pointsAwarded,
    completed: quizAnswer.status === "confirmed",
    user_id: quizAnswer.userId,
    course_id: course.moocfiId,
    service_id: process.env.SERVICE_ID || "",
    required_actions: messages,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
  }

  if (course.moocfiId) {
    await produce("user-points-2", message)
  }
}

export const setTaskToUpdateAndBroadcast = async (
  courseId: string,
  ctx: Knex.Transaction,
) => {
  await ctx("kafka_task").insert({
    course_id: courseId,
    recalculate_progress: true,
  })
}

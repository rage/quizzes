import { Inject, Service } from "typedi"
import { EntityManager } from "typeorm"
import { Quiz, QuizAnswer, UserQuizState } from "../models"
import {
  ExerciseData,
  PointsByGroup,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
} from "../types"
import QuizService from "./quiz.service"
import UserCoursePartStateService from "./usercoursepartstate.service"

// tslint:disable-next-line:no-var-requires
const Kafka = require("node-rdkafka")

@Service()
export default class KafkaService {
  @Inject()
  private quizService: QuizService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  private progressStream = Kafka.Producer.createWriteStream(
    {
      "metadata.broker.list": process.env.KAFKA_URI,
    },
    {},
    {
      topic: "user-course-progress",
    },
  )

  private userPointsStream = Kafka.Producer.createWriteStream(
    {
      "metadata.broker.list": process.env.KAFKA_URI,
    },
    {},
    {
      topic: "user-points",
    },
  )

  private exerciseStream = Kafka.Producer.createWriteStream(
    {
      "metadata.broker.list": process.env.KAFKA_URI,
    },
    {},
    {
      topic: "exercise",
    },
  )

  public async publishUserProgressUpdated(
    manager: EntityManager,
    userId: number,
    courseId: string,
  ) {
    const progress: PointsByGroup[] = await this.userCoursePartStateService.getProgress(
      manager,
      userId,
      courseId,
    )
    const message: ProgressMessage = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      course_id: courseId,
      service_id: process.env.SERVICE_ID,
      progress,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }
    this.progressStream.write(Buffer.from(JSON.stringify(message)))
  }

  public async publishQuizAnswerUpdated(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    const message: QuizAnswerMessage = {
      timestamp: new Date().toISOString(),
      exercise_id: quizAnswer.quizId,
      n_points: quiz.excludedFromScore ? 0 : userQuizState.pointsAwarded,
      completed: quizAnswer.status === "confirmed",
      user_id: quizAnswer.userId,
      course_id: quiz.courseId,
      service_id: process.env.SERVICE_ID,
      required_actions: "",
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }
    this.userPointsStream.write(Buffer.from(JSON.stringify(message)))
  }

  public async publishCourseQuizzesUpdated(courseId: string) {
    const quizzes: Quiz[] = await this.quizService.getQuizzes({ courseId })

    const data: ExerciseData[] = quizzes.map(quiz => {
      return {
        name: quiz.texts[0].title,
        id: quiz.id,
        part: quiz.part,
        section: quiz.section,
        max_points: quiz.excludedFromScore ? 0 : quiz.points,
        deleted: false,
      }
    })

    const message: QuizMessage = {
      timestamp: new Date().toISOString(),
      course_id: courseId,
      service_id: process.env.SERVICE_ID,
      data,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }

    this.exerciseStream.write(Buffer.from(JSON.stringify(message)))
  }
}

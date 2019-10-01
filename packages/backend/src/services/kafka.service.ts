import { Inject, Service } from "typedi"
import { EntityManager } from "typeorm"
import { Course, Quiz, QuizAnswer, UserQuizState } from "../models"
import {
  ExerciseData,
  PointsByGroup,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
} from "../types"
import QuizService from "./quiz.service"
import QuizAnswerService from "./quizanswer.service"
import UserCoursePartStateService from "./usercoursepartstate.service"
import UserQuizStateService from "./userquizstate.service"

// tslint:disable-next-line:no-var-requires
const Kafka = require("node-rdkafka")

@Service()
export default class KafkaService {
  @Inject(type => QuizService)
  private quizService: QuizService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

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
    const course = await manager
      .createQueryBuilder(Course, "course")
      .where("course.id = :courseId", { courseId })
      .getOne()

    const progress: PointsByGroup[] = await this.userCoursePartStateService.getProgress(
      manager,
      userId,
      courseId,
    )
    const message: ProgressMessage = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      course_id: course.moocfiId,
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
    const messages: string[] = []
    const course = quiz.course

    if (quizAnswer.status === "rejected" || quizAnswer.status === "spam") {
      messages.push("rejected in peer review")
    } else if (quiz.items[0].type === "essay") {
      if (userQuizState.peerReviewsGiven < course.minPeerReviewsGiven) {
        messages.push("give peer reviews")
      }
      if (userQuizState.peerReviewsReceived < course.minPeerReviewsReceived) {
        messages.push("waiting for peer reviews")
      }
    }

    const message: QuizAnswerMessage = {
      timestamp: new Date().toISOString(),
      exercise_id: quizAnswer.quizId,
      n_points: quiz.excludedFromScore ? 0 : userQuizState.pointsAwarded,
      completed: quizAnswer.status === "confirmed",
      user_id: quizAnswer.userId,
      course_id: course.moocfiId,
      service_id: process.env.SERVICE_ID,
      required_actions: messages,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }
    this.userPointsStream.write(Buffer.from(JSON.stringify(message)))
  }

  public async publishCourseQuizzesUpdated(courseId: string) {
    const quizzes: Quiz[] = await this.quizService.getQuizzes({
      courseId,
      course: true,
    })

    const course = quizzes[0].course

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
      course_id: course.moocfiId,
      service_id: process.env.SERVICE_ID,
      data,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }

    this.exerciseStream.write(Buffer.from(JSON.stringify(message)))
  }
}

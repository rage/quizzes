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

import * as Kafka from "node-rdkafka"

import { promisify } from "util"

import { quizzes as knex } from "../config/knex"

export enum RequiredAction {
  REJECTED = "REJECTED",
  GIVE_PEER_REVIEW = "GIVE_PEER_REVIEW",
  PENDING_PEER_REVIEW = "PENDING_PEER_REVIEW",
}

@Service()
export default class KafkaService {
  @Inject(type => QuizService)
  private quizService: QuizService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  private knex = knex

  private producer: any

  private flush: any

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

    if (course.moocfiId) {
      await this.produce("user-course-progress", message)
    }
  }

  public async publishQuizAnswerUpdated(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    const messages: RequiredAction[] = []
    const course = quiz.course

    if (quizAnswer.status === "rejected" || quizAnswer.status === "spam") {
      messages.push(RequiredAction.REJECTED)
    } else if (quiz.items[0].type === "essay") {
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
      service_id: process.env.SERVICE_ID,
      required_actions: messages,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
      attempted: true,
    }

    if (course.moocfiId) {
      await this.produce("user-points-realtime", message)
    }
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
    if (course.moocfiId) {
      await this.produce("exercise", message)
    }
  }

  public async addTask(courseId: string, manager: EntityManager) {
    const query = this.knex("kafka_task").insert({ course_id: courseId })
    await manager.query(query.toString())
  }

  private connect() {
    return new Promise((resolve, reject) => {
      this.producer.connect({}, (err: Error, data: any) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }

  private async produce(
    topic: "user-course-progress" | "user-points-realtime" | "exercise",
    message: ProgressMessage | QuizAnswerMessage | QuizMessage,
  ) {
    try {
      if (!this.producer) {
        this.producer = new Kafka.Producer({
          "metadata.broker.list": process.env.KAFKA_HOST || "localhost:9092",
          dr_cb: false,
        })
        await this.connect()
        this.flush = promisify(this.producer.flush.bind(this.producer))
      }
      this.producer.produce(topic, null, Buffer.from(JSON.stringify(message)))
      await this.flush(1000)
    } catch (error) {
      console.log("producer failed")
    }
  }
}

import Knex from "knex"
import {
  ExerciseData,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
  RequiredAction,
} from "../types"
import {
  Course,
  KafkaMessage,
  Quiz,
  QuizAnswer,
  UserQuizState,
} from "../models"
import UserCoursePartState from "../models/user_course_part_state"
import knex from "../../database/knex"

export const broadcastUserProgressUpdated = async (
  userId: number,
  courseId: string,
  trx: Knex.Transaction,
) => {
  const course = await Course.query(trx).findById(courseId)
  if (!course.moocfiId) {
    return
  }
  const progress = await UserCoursePartState.getProgress(userId, courseId, trx)
  const message: ProgressMessage = {
    timestamp: new Date().toISOString(),
    user_id: userId,
    course_id: course.moocfiId,
    service_id: process.env.SERVICE_ID || "",
    progress,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
  }

  await KafkaMessage.createMessageEntry(
    "user-course-progress-realtime",
    message,
    trx,
  )
}

export const broadcastQuizAnswerUpdated = async (
  quizAnswer: QuizAnswer,
  userQuizState: UserQuizState,
  quiz: Quiz,
  trx: Knex.Transaction,
) => {
  const messages: RequiredAction[] = []
  const course = await quiz.$relatedQuery("course", trx)
  if (!course.moocfiId) {
    return
  }
  const items = await quiz.$relatedQuery("items", trx)

  if (quizAnswer.status === "rejected" || quizAnswer.status === "spam") {
    messages.push(RequiredAction.REJECTED)
  } else if (items[0].type === "essay") {
    if (userQuizState.peerReviewsGiven < course.minPeerReviewsGiven) {
      messages.push(RequiredAction.GIVE_PEER_REVIEW)
    }
    if (
      userQuizState.peerReviewsReceived ??
      0 < course.minPeerReviewsReceived
    ) {
      messages.push(RequiredAction.PENDING_PEER_REVIEW)
    }
  }

  const message: QuizAnswerMessage = {
    timestamp: new Date().toISOString(),
    original_submission_date: quizAnswer.createdAt,
    exercise_id: quizAnswer.quizId,
    n_points: quiz.excludedFromScore ? 0 : userQuizState.pointsAwarded ?? 0,
    completed: quizAnswer.status === "confirmed",
    user_id: quizAnswer.userId,
    course_id: course.moocfiId,
    service_id: process.env.SERVICE_ID || "",
    required_actions: messages,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    attempted: quizAnswer.deleted ? false : true,
  }

  await KafkaMessage.createMessageEntry("user-points-realtime", message, trx)
}

export const broadcastCourseQuizzesUpdated = async (
  courseId: string,
  trx: Knex.Transaction,
) => {
  const course = await Course.query(trx).findById(courseId)
  if (!course.moocfiId) {
    return
  }
  const quizzes = await Quiz.query(trx)
    .where("course_id", courseId)
    .whereNot("part", 0)
    .withGraphJoined("texts")

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
    service_id: process.env.SERVICE_ID ?? "",
    data,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
  }
  await KafkaMessage.createMessageEntry("exercise", message, trx)
}

export const broadcastUserCourse = async (userId: number, courseId: string) => {
  await UserCoursePartState.refreshCourse(userId, courseId)
  const quizAnswers = await QuizAnswer.query()
    .withGraphJoined("quiz")
    .withGraphJoined("userQuizState")
    .where("quiz_answer.user_id", userId)
    .andWhere("course_id", courseId)
  await knex.transaction(async trx => {
    for (const quizAnswer of quizAnswers) {
      const { quiz, userQuizState } = quizAnswer
      await broadcastQuizAnswerUpdated(quizAnswer, userQuizState, quiz, trx)
    }
    await broadcastUserProgressUpdated(userId, courseId, trx)
  })
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

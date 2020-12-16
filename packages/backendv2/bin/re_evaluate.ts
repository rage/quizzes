import knex from "../database/knex"
import * as Kafka from "../src/services/kafka"
import {
  Quiz,
  Course,
  UserQuizState,
  UserCoursePartState,
  QuizAnswer,
} from "../src/models"
import { Abort } from "./task_manager/util"

export default async function reEvaluate(quizId: string, passToCaller: any) {
  const trx = await knex.transaction()
  try {
    const quiz = (
      await Quiz.query(trx)
        .where("quiz.id", quizId)
        .withGraphJoined("items.[options]")
        .withGraphJoined("peerReviews")
    )[0]
    const course = await Course.query(trx).findById(quiz.courseId)
    const quizAnswers = await QuizAnswer.query(trx)
      .where("quiz_answer.quiz_id", quizId)
      .andWhereNot("quiz_answer.status", "deprecated")
      .withGraphJoined("itemAnswers.[optionAnswers]")

    let abort: boolean = false
    let tick: number = 1

    passToCaller({
      cancel: () => (abort = true),
      report: () => tick / quizAnswers.length,
    })

    for (const quizAnswer of quizAnswers) {
      if (abort) {
        throw new Abort("re_eval")
      }
      const userQuizState = await UserQuizState.getByUserAndQuiz(
        quizAnswer.userId,
        quizId,
      )
      if (!userQuizState) {
        continue
      }
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      QuizAnswer.assessAnswer(quizAnswer, quiz)
      QuizAnswer.gradeAnswer(quizAnswer, userQuizState, quiz)
      QuizAnswer.assessUserQuizStatus(quizAnswer, userQuizState, quiz, true)
      await QuizAnswer.save(quizAnswer, trx)
      const { userId, ...data } = userQuizState
      if (userId) {
        await UserQuizState.query(trx)
          .update(data)
          .whereComposite(["user_id", "quiz_id"], [userId, quizId])
      }
      /*if (quizAnswer.status === "confirmed") {
        await UserCoursePartState.update(
          quizAnswer.userId,
          quiz.courseId,
          quiz.part,
          trx,
        )
        await Kafka.broadcastQuizAnswerUpdated(
          quizAnswer,
          userQuizState,
          quiz,
          trx,
        )
        await Kafka.broadcastUserProgressUpdated(
          quizAnswer.userId,
          quiz.courseId,
          trx,
        )
      }*/
      tick++
    }
    console.log("re_eval committing")
    await trx.commit()
    console.log("re_eval done")
  } catch (error) {
    await trx.rollback()
    if (error.constructor === Abort) {
      console.log("re_eval terminated")
    } else {
      console.log(error)
    }
    return false
  }
  return true
}

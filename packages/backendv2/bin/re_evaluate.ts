import knex from "../database/knex"
import * as Kafka from "../src/services/kafka"
import {
  Quiz,
  Course,
  UserQuizState,
  UserCoursePartState,
  QuizAnswer,
} from "../src/models"

export default function reEvaluate(
  quizId: string,
  progress: any,
  passToCaller: any,
) {
  return new Promise(async (resolve, reject) => {
    const trx = await knex.transaction()
    let abort: boolean = false
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
      const progressBar = progress.newBar(`re-evaluating ${quizId} :bar`, {
        total: quizAnswers.length,
      })
      const shouldAbort = () => {
        return abort
      }
      const cancel = () => {
        abort = true
      }

      passToCaller(cancel)

      for (const quizAnswer of quizAnswers) {
        if (shouldAbort()) {
          throw new Error("abort")
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
        if (quizAnswer.status === "confirmed") {
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
        }
        progressBar.tick()
      }
      console.log("committing")
      await trx.commit()
      console.log("done")
      resolve("")
    } catch (error) {
      console.log(error)
      await trx.rollback()
      throw error
    }
  })
}

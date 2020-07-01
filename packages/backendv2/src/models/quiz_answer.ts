import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import { UserInfo } from "../types"
import UserQuizState from "./user_quiz_state"
import Quiz from "./quiz"
import { SubmissionError } from "../util/error"
import { removeNonPrintingCharacters } from "../util/tools"
import knex from "../../database/knex"
import Course from "./course"
import Knex from "knex"

type QuizAnswerStatus =
  | "draft"
  | "given-more-than-enough"
  | "given-enough"
  | "manual-review-once-given-and-received-enough"
  | "manual-review-once-given-enough"
  | "submitted"
  | "manual-review"
  | "confirmed"
  | "enough-received-but-not-given"
  | "spam"
  | "rejected"
  | "deprecated"

class QuizAnswer extends Model {
  id!: string
  userId!: number
  quizId!: string
  languageId!: string
  status!: QuizAnswerStatus
  itemAnswers!: QuizItemAnswer[]
  user!: User

  static get tableName() {
    return "quiz_answer"
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
  }

  public static async save(user: UserInfo, quizAnswer: QuizAnswer) {
    const userId = user.id
    const quizId = quizAnswer.quizId
    const isUserInDb = await User.getById(userId)
    if (!isUserInDb) {
      quizAnswer.user = User.fromJson({ id: userId })
    }
    quizAnswer.userId = user.id
    const quiz = await Quiz.getById(quizId)
    const course = await Course.getById(quiz.courseId)
    quizAnswer.languageId = course.languageId
    const userQuizState =
      (await UserQuizState.getByUserAndQuiz(userId, quizId)) ??
      UserQuizState.fromJson({ userId, quizId })
    this.checkIfSubmittable(quiz, userQuizState)
    this.assessAnswer(quizAnswer, quiz)
    this.assessAnswerStatus(quizAnswer, quiz)
    this.gradeAnswer(quizAnswer, userQuizState, quiz)
    this.assessUserQuizStatus(userQuizState, quiz)
    const trx = await knex.transaction()
    let savedQuizAnswer
    let savedUserQuizState
    try {
      savedQuizAnswer = await this.query(trx).insertGraphAndFetch(quizAnswer)
      savedUserQuizState = await UserQuizState.query(trx).upsertGraphAndFetch(
        userQuizState,
        {
          insertMissing: true,
        },
      )
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw new SubmissionError(error)
    }
    return {
      quiz,
      quizAnswer: savedQuizAnswer,
      userQuizState: savedUserQuizState,
    }
  }

  private static checkIfSubmittable(quiz: Quiz, userQuizState: UserQuizState) {
    if (userQuizState.status === "locked") {
      throw new SubmissionError("already answered")
    }
    if (quiz.deadline && quiz.deadline < new Date()) {
      throw new SubmissionError("no submission past deadline")
    }
    if (quiz.triesLimited && userQuizState.tries >= quiz.tries) {
      throw new SubmissionError("no tries left")
    }
  }

  private static assessAnswer(quizAnswer: QuizAnswer, quiz: Quiz) {
    const quizItemAnswers = quizAnswer.itemAnswers
    const quizItems = quiz.items
    if (!quizItemAnswers || quizItemAnswers.length != quizItems.length) {
      throw new SubmissionError("items answers missing")
    }
    for (const quizItemAnswer of quizItemAnswers) {
      const quizItem = quizItems.find(
        item => (item.id = quizItemAnswer.quizItemId),
      )
      if (!quizItem) {
        throw new SubmissionError("invalid quiz item id")
      }

      switch (quizItem.type) {
        case "open":
          quizItemAnswer.textData = removeNonPrintingCharacters(
            quizItemAnswer.textData,
          ).replace(/\0/g, "")
          const textData = quizItemAnswer.textData
          if (!textData) {
            throw new SubmissionError("no answer provided")
          }
          const validator = new RegExp(quizItem.validityRegex.trim(), "i")
          quizItemAnswer.correct = validator.test(textData.trim())
            ? true
            : false
          break
        case "scale":
          break
        case "essay":
          break
        case "multiple-choice":
          break
        case "checkbox":
          break
        case "research-agreement":
          break
        case "feedback":
          break
        case "custom-frontend-accept-data":
          break
      }
    }
  }

  private static assessAnswerStatus(quizAnswer: QuizAnswer, quiz: Quiz) {
    const hasPeerReviews = quiz.peerReviews.length > 0
    quizAnswer.status = hasPeerReviews ? "submitted" : "confirmed"
  }

  private static gradeAnswer(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    const quizItemAnswers = quizAnswer.itemAnswers
    const nCorrect = quizItemAnswers.filter(
      itemAnswer => itemAnswer.correct === true,
    ).length
    const total = quizItemAnswers.length
    const points = (nCorrect / total) * quiz.points
    const pointsAwarded = userQuizState.pointsAwarded ?? 0
    userQuizState.pointsAwarded =
      points > pointsAwarded ? points : pointsAwarded
  }

  private static assessUserQuizStatus(
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    userQuizState.tries = (userQuizState.tries ?? 0) + 1
    const hasTriesLeft = !quiz.triesLimited || userQuizState.tries < quiz.tries
    userQuizState.status = hasTriesLeft ? "open" : "locked"
  }

  private static async markPreviousAsDeprecated(
    userId: number,
    quizId: string,
    trx: Knex.Transaction,
  ) {}
}

export default QuizAnswer

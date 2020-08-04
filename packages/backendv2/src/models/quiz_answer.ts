import Knex from "knex"
import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import { UserInfo } from "../types"
import PeerReview from "./peer_review"
import Quiz from "./quiz"
import UserQuizState from "./user_quiz_state"
import { BadRequestError } from "../util/error"
import { removeNonPrintingCharacters } from "../util/tools"
import knex from "../../database/knex"
import Course from "./course"

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
  peerReviews!: PeerReview[]
  userQuizState!: UserQuizState

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
    peerReviews: {
      relation: Model.HasManyRelation,
      modelClass: PeerReview,
      join: {
        from: "quiz_answer.id",
        to: "peer_review.quiz_answer_id",
      },
    },
    userQuizState: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserQuizState,
      join: {
        from: ["quiz_answer.user_id", "quiz_answer.quiz_id"],
        to: ["user_quiz_state.user_id", "user_quiz_state.quiz_id"],
      },
    },
  }

  public static async getById(quizAnswerId: string) {
    const quizAnswer = await this.query().findById(quizAnswerId)
    await this.addRelations([quizAnswer])
    return quizAnswer
  }

  public static async getPaginatedByQuizId(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const paginated = await this.query()
      .where("quiz_id", quizId)
      .andWhereNot("status", "deprecated")
      .orderBy("created_at")
      .page(page, pageSize)

    await this.addRelations(paginated.results)
    return paginated
  }

  public static async getPaginatedManualReview(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const paginated = await this.query()
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .orderBy("created_at")
      .page(page, pageSize)

    await this.addRelations(paginated.results)
    return paginated
  }

  public static async setManualReviewStatus(answerId: string, status: QuizAnswerStatus) {
    if (!["confirmed", "rejected"].includes(status)) {
      throw new BadRequestError("invalid status")
    }
    const quizAnswer = await this.query().updateAndFetchById(answerId, {
      status,
    })
    return quizAnswer
  }

  private static async addRelations(quizAnswers: QuizAnswer[]) {
    for (const quizAnswer of quizAnswers) {
      delete quizAnswer.languageId
      quizAnswer.userQuizState = await quizAnswer.$relatedQuery("userQuizState")
      quizAnswer.itemAnswers = await quizAnswer.$relatedQuery("itemAnswers")
      for (const itemAnswer of quizAnswer.itemAnswers) {
        itemAnswer.optionAnswers = await itemAnswer.$relatedQuery(
          "optionAnswers",
        )
      }
      quizAnswer.peerReviews = await quizAnswer.$relatedQuery("peerReviews")
      for (const peerReview of quizAnswer.peerReviews) {
        peerReview.answers = await peerReview.$relatedQuery("answers")
      }
    }
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
      await this.markPreviousAsDeprecated(userId, quizId, trx)
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
      throw new BadRequestError(error)
    }
    return {
      quiz,
      quizAnswer: savedQuizAnswer,
      userQuizState: savedUserQuizState,
    }
  }

  private static checkIfSubmittable(quiz: Quiz, userQuizState: UserQuizState) {
    if (userQuizState.status === "locked") {
      throw new BadRequestError("already answered")
    }
    if (quiz.deadline && quiz.deadline < new Date()) {
      throw new BadRequestError("no submission past deadline")
    }
  }

  private static assessAnswer(quizAnswer: QuizAnswer, quiz: Quiz) {
    const quizItemAnswers = quizAnswer.itemAnswers
    const quizItems = quiz.items
    if (!quizItemAnswers || quizItemAnswers.length != quizItems.length) {
      throw new BadRequestError("item answers missing")
    }
    for (const quizItemAnswer of quizItemAnswers) {
      const quizItem = quizItems.find(
        item => item.id === quizItemAnswer.quizItemId,
      )
      if (!quizItem) {
        throw new BadRequestError("invalid quiz item id")
      }

      switch (quizItem.type) {
        case "open":
          const textData = removeNonPrintingCharacters(quizItemAnswer.textData)
            .replace(/\0/g, "")
            .trim()
          if (!textData) {
            throw new BadRequestError("no answer provided")
          }
          const validityRegex = quizItem.validityRegex.trim()
          const validator = new RegExp(validityRegex, "i")
          quizItemAnswer.correct = validator.test(textData) ? true : false
          break
        case "scale":
          break
        case "essay":
          break
        case "multiple-choice":
          const quizOptionAnswers = quizItemAnswer.optionAnswers
          const quizOptions = quizItem.options
          if (
            !quizOptionAnswers ||
            quizOptionAnswers.length != quizOptions.length
          ) {
            throw new BadRequestError("option answers missing")
          }
          const correctOptionIds = quizOptions
            .filter(quizOption => quizOption.correct === true)
            .map(quizOption => quizOption.id)
          const selectedCorrectOptions = quizOptionAnswers.filter(
            quizOptionAnswer =>
              correctOptionIds.includes(quizOptionAnswer.quizOptionId),
          )
          quizItemAnswer.correct = quizItem.multi
            ? correctOptionIds.length === selectedCorrectOptions.length
            : selectedCorrectOptions.length > 0
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
  ) {
    await this.query(trx)
      .update({ status: "deprecated" })
      .where("user_id", userId)
      .andWhere("quiz_id", quizId)
  }
}

export default QuizAnswer

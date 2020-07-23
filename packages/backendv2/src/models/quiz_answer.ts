import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import UserQuizState from "./user_quiz_state"
import PeerReview from "./peer_review"
import { BadRequestError } from "../util/error"

class QuizAnswer extends Model {
  id!: string
  quizId!: string
  languageId!: string
  status!: string
  itemAnswers!: QuizItemAnswer[]
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

  public static async getByQuizId(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const quizAnswers = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhereNot("status", "deprecated")
        .orderBy("created_at")
        .page(page, pageSize)
    ).results

    const answersAmount = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhereNot("status", "deprecated")
    ).length

    await this.addRelations(quizAnswers)
    return { quizAnswers, answersAmount }
  }

  public static async getAnswersForManualReview(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const quizAnswers = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhere("status", "manual-review")
        .orderBy("created_at")
        .page(page, pageSize)
    ).results

    const answersAmount = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhereNot("status", "deprecated")
    ).length

    await this.addRelations(quizAnswers)
    return { quizAnswers, answersAmount }
  }

  public static async setManualReviewStatus(answerId: string, status: string) {
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
}

export default QuizAnswer

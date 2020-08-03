import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import UserQuizState from "./user_quiz_state"
import PeerReview from "./peer_review"
import { BadRequestError } from "../util/error"
import PeerReviewQuestion from "./peer_review_question"

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
    const quizAnswer = await this.query()
      .findById(quizAnswerId)
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")

    quizAnswer.peerReviews.map(peerReview => {
      if (peerReview.answers.length > 0) {
        return peerReview.answers.map(peerReviewAnswer => {
          peerReviewAnswer.question = this.moveQuestionTextsToparent(
            peerReviewAnswer.question,
          )
        })
      }
    })

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
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")

    paginated.results.map(answer => {
      if (answer.peerReviews.length > 0) {
        answer.peerReviews.map(peerReview => {
          if (peerReview.answers.length > 0) {
            peerReview.answers.map(peerReviewAnswer => {
              peerReviewAnswer.question = this.moveQuestionTextsToparent(
                peerReviewAnswer.question,
              )
            })
          }
        })
      }
    })

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
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")

    paginated.results.map(answer => {
      if (answer.peerReviews.length > 0) {
        answer.peerReviews.map(peerReview => {
          if (peerReview.answers.length > 0) {
            peerReview.answers.map(peerReviewAnswer => {
              peerReviewAnswer.question = this.moveQuestionTextsToparent(
                peerReviewAnswer.question,
              )
            })
          }
        })
      }
    })

    return paginated
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

  private static moveQuestionTextsToparent = (question: PeerReviewQuestion) => {
    question.title = question.texts[0].title
    question.body = question.texts[0].body
    return question
  }
}

export default QuizAnswer

import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import UserQuizState from "./user_quiz_state"
import PeerReview from "./peer_review"
import { BadRequestError } from "../util/error"
import PeerReviewQuestion from "./peer_review_question"
import knex from "../../database/knex"
import Quiz from "./quiz"
import UserCoursePartState from "./user_course_part_state"
import * as Kafka from "../services/kafka"

interface CountObject {
  quizId: number
}

class QuizAnswer extends Model {
  id!: string
  userId!: number
  quizId!: string
  languageId!: string
  status!: string
  itemAnswers!: QuizItemAnswer[]
  peerReviews!: PeerReview[]
  userQuizState!: UserQuizState
  quiz!: Quiz

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
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/quiz`,
      join: {
        from: "quiz_answer.quiz_id",
        to: "quiz.id",
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
    order: "asc" | "desc",
    filters: string[],
  ) {
    let paginated
    if (filters.length === 0) {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    } else {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .whereIn("status", filters)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    }

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
    order: "asc" | "desc",
  ) {
    const paginated = await this.query()
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .orderBy([{ column: "created_at", order: order }])
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
    const trx = await knex.transaction()
    try {
      let quizAnswer = (
        await this.query(trx)
          .where("quiz_answer.id", answerId)
          .withGraphJoined("userQuizState")
          .withGraphJoined("quiz")
      )[0]
      const userQuizState = quizAnswer.userQuizState
      const quiz = quizAnswer.quiz
      if (status === "confirmed") {
        await userQuizState.$query(trx).patch({ pointsAwarded: quiz.points })
      } else if (!quiz.triesLimited || userQuizState.tries < quiz.tries) {
        await userQuizState
          .$query(trx)
          .patch({ peerReviewsReceived: 0, spamFlags: 0, status: "open" })
      }
      quizAnswer = await quizAnswer.$query(trx).patchAndFetch({ status })
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
      await trx.commit()
      return quizAnswer
    } catch (error) {
      await trx.rollback()
      throw new BadRequestError(error)
    }
  }

  public static async getManualReviewCountsByCourseId(courseId: string) {
    const counts: any[] = await this.query()
      .select(["quiz_id"])
      .join("quiz", "quiz_answer.quiz_id", "=", "quiz.id")
      .where("course_id", courseId)
      .andWhere("status", "manual-review")
      .count()
      .groupBy("quiz_id")
    const countByQuizId: { [quizId: string]: number } = {}
    for (const count of counts) {
      countByQuizId[count.quizId] = count.count
    }
    return countByQuizId
  }

  public static async getManualReviewCountByQuizId(quizId: string) {
    const count: any[] = await this.query()
      .select(["quiz_id"])
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .count()
      .groupBy("quiz_id")

    return count[0].count
  }

  public static async getAnswerCountsByStatus(quizId: string) {
    const counts: any[] = await this.query()
      .select("status")
      .where("quiz_id", quizId)
      .count()
      .groupBy("status")

    const total: any[] = await this.query()
      .where("quiz_id", quizId)
      .count()

    const countByStatus: { [status: string]: number } = {}
    for (const count of counts) {
      countByStatus[count.status] = Number(count.count)
    }
    countByStatus["total"] = Number(total[0].count)

    return countByStatus
  }

  public static async getStates() {
    const states = await this.query()
      .select("status")
      .distinct("status")

    return states.map(state => state.status)
  }

  private static moveQuestionTextsToparent = (question: PeerReviewQuestion) => {
    question.title = question.texts[0].title
    question.body = question.texts[0].body
    return question
  }
}

export default QuizAnswer

import { BadRequestError, NotFoundError } from "./../util/error"
import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import Quiz from "./quiz"
import PeerReviewQuestionAnswer from "./peer_review_question_answer"
import PeerReviewQuestion from "./peer_review_question"
import knex from "../../database/knex"
import BaseModel from "./base_model"
import softDelete from "objection-soft-delete"
import { mixin } from "objection"
import { Transaction } from "knex"

class PeerReview extends BaseModel {
  userId!: number
  quizAnswerId!: string
  rejectedQuizAnswerIds!: string[]
  answers!: PeerReviewQuestionAnswer[]
  questions!: PeerReviewQuestion[]

  static get tableName() {
    return "peer_review"
  }

  static relationMappings = {
    quizAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "peer_review.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
    answers: {
      relation: BaseModel.HasManyRelation,
      modelClass: PeerReviewQuestionAnswer,
      join: {
        from: "peer_review.id",
        to: "peer_review_question_answer.peer_review_id",
      },
    },
  }

  public static async getWithAnswersByAnswerId(quizAnswerId: string) {
    // check that answerId exists
    try {
      await QuizAnswer.getById(quizAnswerId)
    } catch (error) {
      throw error
    }

    const peerReviews = await this.query()
      .where("quiz_answer_id", quizAnswerId)
      .withGraphJoined("answers")
      .limit(100)

    return peerReviews
  }

  public static async givePeerReview(peerReview: PeerReview) {
    peerReview.answers.forEach((answer: PeerReviewQuestionAnswer): void => {
      if (answer.text) {
        return
      }
      if (answer.value === null) {
        throw new BadRequestError("review must contain values")
      }
    })

    const { quizAnswerId, userId: sourceUserId } = peerReview

    // validate quiz answer id
    try {
      await QuizAnswer.getById(quizAnswerId)
    } catch (error) {
      throw error
    }

    // check if peer review already given by this user for this quiz answer
    const peerReviewAlreadyGiven = await this.getByUserIdAndQuizAnswerId(
      sourceUserId,
      quizAnswerId,
    )
    if (peerReviewAlreadyGiven) {
      throw new BadRequestError("Answer can only be peer reviewed once")
    }

    const targetQuizAnswer = await QuizAnswer.getById(quizAnswerId)

    const quizId = targetQuizAnswer.quizId

    const sourceQuizAnswer = await QuizAnswer.getByUserAndQuiz(
      sourceUserId,
      quizId,
    )

    const quiz = await Quiz.getById(quizId)
    quiz.course = await quiz.$relatedQuery("course")

    const { userId: targetUserId } = targetQuizAnswer

    // cannot peer review own answer
    if (sourceUserId === targetUserId) {
      throw new BadRequestError("User cannot review their own answer")
    }

    let sourceUserQuizState, targetUserQuizState

    sourceUserQuizState = await UserQuizState.getByUserAndQuiz(
      sourceUserId,
      quizId,
    )

    targetUserQuizState = await UserQuizState.getByUserAndQuiz(
      targetUserId,
      quizId,
    )

    if (!sourceUserQuizState || !targetUserQuizState) {
      throw new NotFoundError(`User quiz state not found.`)
    }

    // increment peer review stats for both source and target users
    if (sourceUserQuizState.peerReviewsGiven === null) {
      sourceUserQuizState.peerReviewsGiven = 1
    } else {
      sourceUserQuizState.peerReviewsGiven += 1
    }

    if (targetUserQuizState.peerReviewsReceived === null) {
      targetUserQuizState.peerReviewsReceived = 1
    } else {
      targetUserQuizState.peerReviewsReceived += 1
    }

    const trx = await knex.transaction()

    try {
      // create the peer review
      const newPeerReview = await this.query(trx).insertGraphAndFetch(
        this.fromJson(peerReview),
      )

      // update quiz answers for both users
      await QuizAnswer.update(sourceQuizAnswer, sourceUserQuizState, quiz, trx)
      await QuizAnswer.update(targetQuizAnswer, targetUserQuizState, quiz, trx)

      await QuizAnswer.save(sourceQuizAnswer, trx)
      await QuizAnswer.save(targetQuizAnswer, trx)

      // update quiz states for both users
      await UserQuizState.upsert(sourceUserQuizState, trx)
      await UserQuizState.upsert(targetUserQuizState, trx)

      await trx.commit()

      return {
        peerReview: newPeerReview,
        quizAnswer: sourceQuizAnswer,
        userQuizState: sourceUserQuizState,
      }
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  public static async getByUserIdAndQuizAnswerId(
    userId: number,
    quizAnswerId: string,
  ): Promise<PeerReview | undefined> {
    if (!userId || !quizAnswerId) {
      throw new BadRequestError(
        `user_id or quiz_answer_id invalid: user_id: ${userId}, quiz_answer_id: ${quizAnswerId}`,
      )
    }
    const peerReview = (
      await this.query()
        .where({ user_id: userId, quiz_answer_id: quizAnswerId })
        .limit(1)
    )[0]

    return peerReview
  }
}

export default PeerReview

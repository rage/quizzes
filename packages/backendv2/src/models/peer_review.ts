import { BadRequestError, NotFoundError } from "./../util/error"
import Model from "./base_model"
import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import Quiz from "./quiz"
import PeerReviewQuestionAnswer from "./peer_review_question_answer"
import PeerReviewQuestion from "./peer_review_question"
import knex from "../../database/knex"

class PeerReview extends Model {
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
      relation: Model.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "peer_review.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
    answers: {
      relation: Model.HasManyRelation,
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
      await QuizAnswer.getByIdWithPeerReviews(quizAnswerId)
    } catch (error) {
      throw error
    }

    const peerReviews = await this.query()
      .where("quiz_answer_id", quizAnswerId)
      .withGraphJoined("answers")

    return peerReviews
  }

  public static async givePeerReview(peerReview: PeerReview) {
    // TODO: type callback argument ?
    peerReview.answers.forEach((answer: any): void => {
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

    // TODO: check target quiz answer id is valid
    const targetQuizAnswer = await QuizAnswer.getById(quizAnswerId)

    const quizId = targetQuizAnswer.quizId

    const sourceQuizAnswer = await QuizAnswer.getByUserAndQuiz(
      sourceUserId,
      quizId,
    )

    const quiz = await Quiz.getById(quizId)
    quiz.course = await quiz.$relatedQuery("course")

    const { userId: targetUserId } = targetQuizAnswer

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

      // TODO: upsert needed until QuizAnswer.update() saves to db
      await QuizAnswer.query(trx).upsertGraph(sourceQuizAnswer)
      await QuizAnswer.query(trx).upsertGraph(targetQuizAnswer)

      // update quiz states for both users
      await UserQuizState.query(trx).upsertGraph(sourceUserQuizState)
      await UserQuizState.query(trx).upsertGraph(targetUserQuizState)

      trx.commit()

      return {
        peerReview: newPeerReview,
        quizAnswer: sourceQuizAnswer,
        userQuizState: sourceUserQuizState,
      }
    } catch (err) {
      trx.rollback()
      throw new BadRequestError(err)
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

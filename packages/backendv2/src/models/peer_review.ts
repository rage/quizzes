import { BadRequestError } from "./../util/error"
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

    const sourceUserQuizState = await UserQuizState.getByUserAndQuiz(
      sourceUserId,
      quizId,
    )
    const targetUserQuizState = await UserQuizState.getByUserAndQuiz(
      targetUserId,
      quizId,
    )

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
    return (
      await this.query()
        .where({ user_id: userId, quiz_answer_id: quizAnswerId })
        .limit(1)
    )[0]
  }
}

export default PeerReview

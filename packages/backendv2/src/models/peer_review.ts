import _ from "lodash"
import { mixin } from "objection"

import knex from "../../database/knex"
import { BadRequestError, ForbiddenError, NotFoundError } from "./../util/error"
import BaseModel from "./base_model"
import PeerReviewQuestion from "./peer_review_question"
import PeerReviewQuestionAnswer from "./peer_review_question_answer"
import Quiz from "./quiz"
import QuizAnswer from "./quiz_answer"
import softDelete from "./soft_delete"
import UserQuizState from "./user_quiz_state"

// The widget grades on likert-react's default scale: five icons valued 1 to 5.
const MIN_GRADE = 1
const MAX_GRADE = 5

class PeerReview extends BaseModel {
  id!: string
  userId!: number
  quizAnswerId!: string
  peerReviewCollectionId!: string
  rejectedQuizAnswerIds!: string[]
  answers!: PeerReviewQuestionAnswer[]
  questions!: PeerReviewQuestion[]

  static get tableName() {
    return "peer_review"
  }

  static relationMappings = () => ({
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
  })

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

  /** Builds a review by `userId` from a widget submission body, keeping only the fields a reviewer sets. */
  public static fromSubmission(body: any, userId: number): PeerReview {
    if (!Array.isArray(body?.answers) || body.answers.length === 0) {
      throw new BadRequestError("review must contain answers")
    }
    return this.fromJson({
      ..._.pick(body, [
        "quizAnswerId",
        "peerReviewCollectionId",
        "rejectedQuizAnswerIds",
      ]),
      userId,
      answers: body.answers.map((answer: any) =>
        _.pick(answer, ["peerReviewQuestionId", "value", "text"]),
      ),
    })
  }

  /**
   * Stores a review; `peerReview` must come from `fromSubmission`.
   *
   * Unless `skipGiverRequirements`, the reviewer must have a current answer to the quiz
   * (ForbiddenError) and the reviewed answer must be open for review.
   */
  public static async givePeerReview(
    peerReview: PeerReview,
    skipGiverRequirements: boolean = false,
  ) {
    for (const answer of peerReview.answers) {
      const hasValue = answer.value !== null && answer.value !== undefined
      if (
        hasValue &&
        !(
          Number.isInteger(answer.value) &&
          answer.value >= MIN_GRADE &&
          answer.value <= MAX_GRADE
        )
      ) {
        throw new BadRequestError(
          `review values must be integers from ${MIN_GRADE} to ${MAX_GRADE}`,
        )
      }
      if (
        answer.text !== null &&
        answer.text !== undefined &&
        typeof answer.text !== "string"
      ) {
        throw new BadRequestError("review texts must be strings")
      }
      if (!hasValue && !answer.text) {
        throw new BadRequestError("review must contain values")
      }
    }

    const { quizAnswerId, userId: sourceUserId } = peerReview

    const targetQuizAnswer = await QuizAnswer.getById(quizAnswerId)
    const quizId = targetQuizAnswer.quizId
    const { userId: targetUserId } = targetQuizAnswer

    if (sourceUserId === targetUserId) {
      throw new BadRequestError("User cannot review their own answer")
    }

    let sourceQuizAnswer: QuizAnswer | null = null
    if (!skipGiverRequirements) {
      sourceQuizAnswer =
        (await QuizAnswer.getByUserAndQuiz(sourceUserId, quizId)) ?? null
      if (!sourceQuizAnswer || sourceQuizAnswer.deleted) {
        throw new ForbiddenError("answer the quiz before reviewing others")
      }
      if (!QuizAnswer.isOpenForReview(targetQuizAnswer)) {
        throw new BadRequestError("answer is not open for review")
      }
    }

    // check if peer review already given by this user for this quiz answer
    const peerReviewAlreadyGiven = await this.getByUserIdAndQuizAnswerId(
      sourceUserId,
      quizAnswerId,
    )
    const isUpdating = skipGiverRequirements && peerReviewAlreadyGiven
    if (peerReviewAlreadyGiven && !skipGiverRequirements) {
      throw new BadRequestError("Answer can only be peer reviewed once")
    }

    const typeByQuestionId = await this.checkQuestionsBelongToQuiz(
      peerReview,
      quizId,
    )
    for (const answer of peerReview.answers) {
      const matchesQuestionType =
        typeByQuestionId.get(answer.peerReviewQuestionId) === "grade"
          ? answer.value !== null &&
            answer.value !== undefined &&
            (answer.text === null || answer.text === undefined)
          : Boolean(answer.text) &&
            (answer.value === null || answer.value === undefined)
      if (!matchesQuestionType) {
        throw new BadRequestError(
          "grade questions take a value and essay questions a text",
        )
      }
    }

    const quiz = await Quiz.getById(quizId)
    quiz.course = await quiz.$relatedQuery("course")

    let sourceUserQuizState: UserQuizState | null = null

    if (!skipGiverRequirements) {
      sourceUserQuizState =
        (await UserQuizState.getByUserAndQuiz(sourceUserId, quizId)) ?? null
    }

    const targetUserQuizState = await UserQuizState.getByUserAndQuiz(
      targetUserId,
      quizId,
    )

    if (!targetUserQuizState) {
      throw new NotFoundError(`User quiz state not found.`)
    }

    if (!skipGiverRequirements && !sourceUserQuizState) {
      throw new NotFoundError(`User quiz state not found.`)
    }

    // increment peer review stats for both source and target users
    if (!skipGiverRequirements && sourceUserQuizState) {
      if (sourceUserQuizState.peerReviewsGiven === null) {
        sourceUserQuizState.peerReviewsGiven = 1
      } else {
        sourceUserQuizState.peerReviewsGiven += 1
      }
    }

    if (!isUpdating) {
      if (targetUserQuizState.peerReviewsReceived === null) {
        targetUserQuizState.peerReviewsReceived = 1
      } else {
        targetUserQuizState.peerReviewsReceived += 1
      }
    }

    const trx = await knex.transaction()

    try {
      let newPeerReview: PeerReview
      if (isUpdating && peerReviewAlreadyGiven) {
        const peerReviewData = this.fromJson(peerReview)
        peerReviewData.id = peerReviewAlreadyGiven.id
        newPeerReview = await this.query(trx)
          .allowGraph("answers")
          .upsertGraphAndFetch(peerReviewData)
      } else {
        newPeerReview = await this.query(trx)
          .allowGraph("answers")
          .insertGraphAndFetch(this.fromJson(peerReview))
      }

      // update quiz answers for both users
      if (!skipGiverRequirements && sourceQuizAnswer && sourceUserQuizState) {
        await QuizAnswer.update(
          sourceQuizAnswer,
          sourceUserQuizState,
          quiz,
          trx,
        )
        await QuizAnswer.save(sourceQuizAnswer, trx)
      }
      await QuizAnswer.update(targetQuizAnswer, targetUserQuizState, quiz, trx)
      await QuizAnswer.save(targetQuizAnswer, trx)

      // update quiz states for both users
      if (!skipGiverRequirements && sourceUserQuizState) {
        await UserQuizState.upsert(sourceUserQuizState, trx)
      }
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

  /**
   * Throws a BadRequestError unless the review's collection belongs to the quiz and every
   * answer is to a distinct question of that collection. Deleted ones count, as a widget may still
   * show them.
   *
   * Returns the type of each answered question by its id.
   */
  private static async checkQuestionsBelongToQuiz(
    peerReview: PeerReview,
    quizId: string,
  ): Promise<Map<string, "essay" | "grade">> {
    const collection =
      peerReview.peerReviewCollectionId &&
      (await knex("peer_review_collection")
        .select("id")
        .where({ id: peerReview.peerReviewCollectionId, quiz_id: quizId })
        .first())
    if (!collection) {
      throw new BadRequestError(
        "peer review collection does not belong to the quiz",
      )
    }
    const questionIds = new Set(
      peerReview.answers.map((answer) => answer.peerReviewQuestionId),
    )
    if (questionIds.size !== peerReview.answers.length) {
      throw new BadRequestError(
        "peer review questions can be answered only once",
      )
    }
    const questions: { id: string; type: "essay" | "grade" }[] = await knex(
      "peer_review_question",
    )
      .select("id", "type")
      .whereIn("id", [...questionIds])
      .andWhere("peer_review_collection_id", collection.id)
    if (questions.length !== questionIds.size) {
      throw new BadRequestError(
        "peer review question does not belong to the collection",
      )
    }
    return new Map(questions.map((question) => [question.id, question.type]))
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

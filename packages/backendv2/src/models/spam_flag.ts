import type { Knex } from "knex"

import knex from "../../database/knex"
import { BadRequestError, ForbiddenError, NotFoundError } from "../util/error"
import BaseModel from "./base_model"
import Quiz from "./quiz"
import QuizAnswer from "./quiz_answer"
import QuizAnswerStatusModification from "./quiz_answer_status_modification"
import User from "./user"
import UserQuizState from "./user_quiz_state"

class SpamFlag extends BaseModel {
  id!: string
  userId!: number
  quizAnswerId!: string

  static get tableName() {
    return "spam_flag"
  }

  static relationMappings = () => ({
    user: {
      relation: BaseModel.HasManyRelation,
      modelClass: User,
      join: {
        from: "spam_flag.user_id",
        to: "user.id",
      },
    },
    quizAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: `${__dirname}/quiz_answer`,
      join: {
        from: "spam_flag.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
  })

  /**
   * Records `flaggingUserId`'s spam flag on another student's answer to a quiz they have a
   * current answer to; throws a ForbiddenError otherwise.
   */
  public static async reportSpam(
    quizAnswerId: string,
    flaggingUserId: number,
  ): Promise<SpamFlag | BadRequestError> {
    const { userId: authorId, quizId } =
      await QuizAnswer.getOwnerAndQuiz(quizAnswerId)
    if (authorId === flaggingUserId) {
      throw new ForbiddenError("cannot flag your own answer")
    }
    if (!(await QuizAnswer.hasCurrentAnswer(flaggingUserId, quizId))) {
      throw new ForbiddenError("answer the quiz before flagging others")
    }
    const trx = await knex.transaction()
    try {
      await UserQuizState.lock(authorId, quizId, trx)
      const quizAnswer = await QuizAnswer.getById(quizAnswerId, trx)
      if (!QuizAnswer.isOpenForReview(quizAnswer)) {
        throw new BadRequestError("answer is not open for review")
      }
      if (
        await this.getSpamFlagByUserIdAndQuizAnswerId(
          flaggingUserId,
          quizAnswerId,
          trx,
        )
      ) {
        throw new BadRequestError("Can only give one spam flag")
      }
      const quiz = await Quiz.getById(quizId, trx)

      const userQuizState = await UserQuizState.getByUserAndQuiz(
        authorId,
        quizId,
        trx,
      )
      if (!userQuizState) {
        throw new NotFoundError("No quiz state for the answer's author")
      }

      if (userQuizState.spamFlags === null) {
        userQuizState.spamFlags = 1
      } else {
        userQuizState.spamFlags += 1
      }
      const newSpamFlag = await this.query(trx).insertAndFetch(
        this.fromJson({
          userId: flaggingUserId,
          quizAnswerId,
        }),
      )

      await QuizAnswer.update(quizAnswer, userQuizState, quiz, trx)

      await QuizAnswer.save(quizAnswer, trx)

      await UserQuizState.upsert(userQuizState, trx)

      await trx.commit()

      return newSpamFlag
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  public static async getSpamFlagByUserIdAndQuizAnswerId(
    userId: number,
    quizAnswerId: string,
    trx?: Knex.Transaction,
  ): Promise<SpamFlag | undefined> {
    return (
      await this.query(trx)
        .select("*")
        .where({ user_id: userId, quiz_answer_id: quizAnswerId })
        .withGraphFetched("user")
        .withGraphFetched("quizAnswer")
        .limit(1)
    )[0]
  }
}

export default SpamFlag

import knex from "../../database/knex"
import { BadRequestError, NotFoundError } from "../util/error"
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

  public static async reportSpam(
    quizAnswerId: string,
    flaggingUserId: number,
  ): Promise<SpamFlag | BadRequestError> {
    if (
      await this.getSpamFlagByUserIdAndQuizAnswerId(
        flaggingUserId,
        quizAnswerId,
      )
    ) {
      throw new BadRequestError("Can only give one spam flag")
    } else {
      const quizAnswer = await QuizAnswer.getById(quizAnswerId)

      const quiz = await Quiz.getById(quizAnswer.quizId)

      const userQuizState = await UserQuizState.getByUserAndQuiz(
        quizAnswer.userId,
        quiz.id,
      )
      if (!userQuizState) {
        throw new NotFoundError("No quiz state for the answer's author")
      }

      if (userQuizState.spamFlags === null) {
        userQuizState.spamFlags = 1
      } else {
        userQuizState.spamFlags += 1
      }
      const trx = await knex.transaction()
      try {
        const newSpamFlag = await this.query(trx).insertAndFetch(
          this.fromJson({
            userId: flaggingUserId,
            quizAnswerId,
          }),
        )

        await QuizAnswer.update(quizAnswer, userQuizState, quiz, trx)

        await QuizAnswer.save(quizAnswer, trx)

        const { userId, quizId, ...data } = userQuizState

        await UserQuizState.upsert(userQuizState, trx)

        await trx.commit()

        return newSpamFlag
      } catch (err) {
        await trx.rollback()
        throw err
      }
    }
  }

  public static async getSpamFlagByUserIdAndQuizAnswerId(
    userId: number,
    quizAnswerId: string,
  ): Promise<SpamFlag | undefined> {
    return (
      await this.query()
        .select("*")
        .where({ user_id: userId, quiz_answer_id: quizAnswerId })
        .withGraphFetched("user")
        .withGraphFetched("quizAnswer")
        .limit(1)
    )[0]
  }
}

export default SpamFlag

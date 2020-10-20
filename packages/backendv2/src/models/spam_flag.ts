import { Model } from "objection"
import { BadRequestError } from "../util/error"
import Quiz from "./quiz"
import QuizAnswer from "./quiz_answer"
import User from "./user"
import UserQuizState from "./user_quiz_state"
import knex from "../../database/knex"

class SpamFlag extends Model {
  id!: string
  userId!: number
  quizAnswerId!: string

  static get tableName() {
    return "spam_flag"
  }

  static relationMappings = {
    user: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: "spam_flag.user_id",
        to: "user.id",
      },
    },
    quizAnswer: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/quiz_answer`,
      join: {
        from: "spam_flag.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
  }

  public static async reportSpam(
    quizAnswerId: string,
    userId: number,
  ): Promise<SpamFlag | BadRequestError> {
    if (await this.getSpamFlagByUserIdAndQuizAnswerId(userId, quizAnswerId)) {
      throw new BadRequestError("Can only give one spam flag")
    } else {
      const quizAnswer = await QuizAnswer.getById(quizAnswerId)

      const quiz = await Quiz.getById(quizAnswer.quizId)

      const userQuizState = await UserQuizState.getByUserAndQuiz(
        quizAnswer.userId,
        quiz.id,
      )

      if (userQuizState.spamFlags === null) {
        userQuizState.spamFlags = 1
      } else {
        userQuizState.spamFlags += 1
      }
      const trx = await knex.transaction()
      try {
        const newSpamFlag = await this.query(trx).insertAndFetch(
          this.fromJson({
            userId,
            quizAnswerId,
          }),
        )

        await QuizAnswer.update(quizAnswer, userQuizState, quiz, trx)

        await QuizAnswer.query(trx).upsertGraph(quizAnswer)

        await UserQuizState.query(trx).upsertGraph(userQuizState)
        trx.commit()
        return newSpamFlag
      } catch (err) {
        trx.rollback()
        throw new BadRequestError(err)
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
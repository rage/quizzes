import { Model } from "objection"
import { BadRequestError } from "../util/error"
import Quiz from "./quiz"
import QuizAnswer from "./quiz_answer"
import User from "./user"
import UserQuizState from "./user_quiz_state"

class SpamFlag extends Model {
  id!: string
  user_id!: number
  quiz_answer_id!: string

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
      relation: Model.HasManyRelation,
      modelClass: QuizAnswer,
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
      try {
        return this.transaction(async trx => {
          const newSpamFlag = await this.query(trx).upsertGraphAndFetch({
            user_id: userId,
            quiz_answer_id: quizAnswerId,
          })

          await QuizAnswer.validatePeerReviewedAnswer(
            quiz,
            quizAnswer,
            userQuizState,
            trx,
          )
          return newSpamFlag
        })
      } catch (err) {
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

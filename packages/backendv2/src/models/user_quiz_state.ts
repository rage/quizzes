import Quiz from "./quiz"
import User from "./user"
import QuizAnswer from "./quiz_answer"
import Knex from "knex"
import BaseModel from "./base_model"

class UserQuizState extends BaseModel {
  userId!: number
  quizId!: string
  tries!: number
  status!: "open" | "locked"
  pointsAwarded!: number | null
  peerReviewsGiven!: number
  peerReviewsReceived!: number | null
  spamFlags!: number | null

  static get tableName() {
    return "user_quiz_state"
  }

  static get idColumn() {
    return ["user_id", "quiz_id"]
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    quiz: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "user_quiz_state.quiz_id",
        to: "quiz.id",
      },
    },
    quizAnswer: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: ["user_quiz_state.user_id", "user_quiz_state.quiz_id"],
        to: ["quiz_answer.user_id", "quiz_answer.quiz_id"],
      },
    },
  }

  public static async getByUserAndQuiz(
    userId: number,
    quizId: string,
    trx?: Knex.Transaction,
  ): Promise<UserQuizState> {
    return await this.query(trx).findById([userId, quizId])
  }

  public static async save(
    userQuizState: UserQuizState,
    trx: any,
  ): Promise<UserQuizState> {
    return await this.query(trx).insertGraphAndFetch(userQuizState)
  }

  public static async updateAwardedPointsForQuiz(
    oldQuiz: Quiz,
    newQuiz: Quiz,
    trx: Knex.Transaction,
  ) {
    const oldMaxPoints = oldQuiz.points
    const maxPoints = newQuiz.points

    await trx("user_quiz_state")
      .update({
        points_awarded:
          oldMaxPoints === 0
            ? trx.raw(":maxPoints", { maxPoints })
            : trx.raw("(points_awarded * :maxPoints / :oldMaxPoints)", {
                maxPoints,
                oldMaxPoints,
              }),
      })
      .where({ quiz_id: newQuiz.id })
  }
}

export default UserQuizState

import Model from "./base_model"
import Quiz from "./quiz"
import User from "./user"

class UserQuizState extends Model {
  tries!: number

  static get tableName() {
    return "user_quiz_state"
  }

  static get idColumn() {
    return ["user_id", "quiz_id"]
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
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "user_quiz_state.quiz_id",
        to: "quiz.id",
      },
    },
  }

  public static async getByUserAndQuiz(
    userId: number,
    quizId: string,
  ): Promise<UserQuizState> {
    return await this.query().findById([userId, quizId])
  }
}

export default UserQuizState

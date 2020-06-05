import Model from "./base_model"
import QuizAnswer from "./quiz_answer"

class User extends Model {
  static get tableName() {
    return "user"
  }
  static relationMappings = {
    answers: {
      relation: Model.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: "user.id",
        to: "quiz_answer.user_id",
      },
    },
  }
}

export default User

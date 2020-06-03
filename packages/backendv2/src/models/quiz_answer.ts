import { Model } from "objection"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"

class QuizAnswer extends Model {
  id!: string
  quizId!: string
  static get tableName() {
    return "quiz_answer"
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
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
  }
}

export default QuizAnswer

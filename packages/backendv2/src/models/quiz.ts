import { Model } from "objection"
import QuizItem from "./quiz_item"

class Quiz extends Model {
  static get tableName() {
    return "quiz"
  }
  static relationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz.id",
        to: "quiz_item.quiz_id",
      },
    },
  }
}

export default Quiz

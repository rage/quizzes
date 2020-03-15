import { Model } from "objection"
import QuizItem from "./quiz_item"

class QuizOption extends Model {
  static get tableName() {
    return "quiz_option"
  }
  static relationMappings = {
    quizItem: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz_option.quiz_item_id",
        to: "quiz_item.id",
      },
    },
  }
}

export default QuizOption

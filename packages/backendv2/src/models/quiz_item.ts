import { Model } from "objection"
import Quiz from "./quiz"
import QuizOption from "./quiz_option"

class QuizItem extends Model {
  static get tableName() {
    return "quiz_item"
  }
  static relationMappings = {
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "quiz_item.quiz_id",
        to: "quiz.id",
      },
    },
    options: {
      relation: Model.HasManyRelation,
      modelClass: QuizOption,
      join: {
        from: "quiz_item.id",
        to: "quiz_option.quiz_item_id",
      },
    },
  }
}

export default QuizItem

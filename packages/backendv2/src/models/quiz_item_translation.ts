import { Model } from "objection"
import QuizItem from "./quiz_item"

class QuizItemTranslation extends Model {
  static get tableName() {
    return "quiz_item_translation"
  }
  static relationMappings = {
    quizItem: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz_item_translation.quiz_item_id",
        to: "quiz_item.id",
      },
    },
  }
}

export default QuizItemTranslation

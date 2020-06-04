import { Model } from "objection"
import QuizItem from "./quiz_item"
import QuizTranslation from "./quiz_translation"

export class Quiz extends Model {
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
    texts: {
      relation: Model.HasManyRelation,
      modelClass: QuizTranslation,
      join: {
        from: "quiz.id",
        to: "quiz_translation.quiz_id"
      }
    }
  }
}

export default Quiz

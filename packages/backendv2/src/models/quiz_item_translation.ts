import { ModelObject } from "objection"
import BaseModel from "./base_model"
import QuizItem from "./quiz_item"

class QuizItemTranslation extends BaseModel {
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string
  sharedOptionFeedbackMessage!: string

  static get tableName() {
    return "quiz_item_translation"
  }

  static get idColumn() {
    return ["quiz_item_id", "language_id"]
  }

  static relationMappings = {
    quizItem: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz_item_translation.quiz_item_id",
        to: "quiz_item.id",
      },
    },
  }
}

export type QuizItemTranslationType = ModelObject<QuizItemTranslation>

export default QuizItemTranslation

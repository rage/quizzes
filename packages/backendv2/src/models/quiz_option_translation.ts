import { ModelObject } from "objection"
import BaseModel from "./base_model"
import QuizOption from "./quiz_option"

class QuizOptionTranslation extends BaseModel {
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string

  static get tableName() {
    return "quiz_option_translation"
  }

  static get idColumn() {
    return ["quiz_option_id", "language_id"]
  }

  static relationMappings = {
    quizOption: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizOption,
      join: {
        from: "quiz_option_translation.quiz_option_id",
        to: "quiz_option.id",
      },
    },
  }
}

export type QuizOptionTranslationType = ModelObject<QuizOptionTranslation>

export default QuizOptionTranslation

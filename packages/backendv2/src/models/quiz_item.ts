import Quiz from "./quiz"
import QuizOption from "./quiz_option"
import QuizItemTranslation from "./quiz_item_translation"
import BaseModel from "./base_model"
import { mixin, ModelObject } from "objection"
import softDelete from "objection-soft-delete"

export type itemType =
  | "open"
  | "scale"
  | "essay"
  | "multiple-choice"
  | "checkbox"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"
  | "multiple-choice-dropdown"
  | "clickable-multiple-choice"

export type MultipleSelectedOptionsGradingPolicy =
  | "NeedToSelectAllCorrectOptions"
  | "NeedToSelectNCorrectOptions"

class QuizItem extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
  id!: string
  type!: itemType
  validityRegex!: string
  multi!: boolean
  texts!: QuizItemTranslation[]
  options!: QuizOption[]
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string
  sharedOptionFeedbackMessage!: string
  allAnswersCorrect!: boolean
  deleted!: boolean
  direction!: "row" | "column"
  multipleSelectedOptionsGradingOptions!: MultipleSelectedOptionsGradingPolicy
  multipleSelectedOptionsGradingPolicyN!: number

  static get tableName() {
    return "quiz_item"
  }

  static relationMappings = {
    quiz: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "quiz_item.quiz_id",
        to: "quiz.id",
      },
    },
    options: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizOption,
      join: {
        from: "quiz_item.id",
        to: "quiz_option.quiz_item_id",
      },
    },
    texts: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizItemTranslation,
      join: {
        from: "quiz_item.id",
        to: "quiz_item_translation.quiz_item_id",
      },
    },
  }

  static async getById(id: string): Promise<QuizItem> {
    return await this.query().findById(id)
  }
}

export type QuizItemType = ModelObject<QuizItem>

export default QuizItem

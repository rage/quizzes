import Model from "./base_model"
import Quiz from "./quiz"
import QuizOption from "./quiz_option"
import QuizItemTranslation from "./quiz_item_translation"

export type QuizItemType =
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

class QuizItem extends Model {
  id!: string
  type!: QuizItemType
  validityRegex!: string
  multi!: string
  texts!: QuizItemTranslation[]
  options!: QuizOption[]
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string
  sharedOptionFeedbackMessage!: string

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
    texts: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemTranslation,
      join: {
        from: "quiz_item.id",
        to: "quiz_item_translation.quiz_item_id",
      },
    },
  }
}

export default QuizItem

import Model from "./base_model"
import QuizItem from "./quiz_item"
import QuizOptionTranslation from "./quiz_option_translation"

class QuizOption extends Model {
  id!: string
  correct!: boolean
  texts!: QuizOptionTranslation[]
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string

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
    texts: {
      relation: Model.HasManyRelation,
      modelClass: QuizOptionTranslation,
      join: {
        from: "quiz_option.id",
        to: "quiz_option_translation.quiz_option_id",
      },
    },
  }
}

export default QuizOption

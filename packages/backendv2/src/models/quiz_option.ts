import BaseModel from "./base_model"
import QuizItem from "./quiz_item"
import QuizOptionTranslation, {
  QuizOptionTranslationType,
} from "./quiz_option_translation"
import { mixin, ModelObject } from "objection"
import softDelete from "objection-soft-delete"
class QuizOption extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
  id!: string
  correct!: boolean
  texts!: QuizOptionTranslation[]
  title!: string
  body!: string
  successMessage!: string
  failureMessage!: string
  deleted!: boolean

  static get tableName() {
    return "quiz_option"
  }

  static relationMappings = {
    quizItem: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz_option.quiz_item_id",
        to: "quiz_item.id",
      },
    },
    texts: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizOptionTranslation,
      join: {
        from: "quiz_option.id",
        to: "quiz_option_translation.quiz_option_id",
      },
    },
  }

  static async getById(id: string): Promise<QuizOption> {
    return await this.query().findById(id)
  }
}

export type QuizOptionType = ModelObject<QuizOption>

export default QuizOption

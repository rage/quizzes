import { Model } from "objection"
import QuizOption from "./quiz_option"

class QuizOptionTranslation extends Model {
  static get tableName() {
    return "quiz_option_translation"
  }
  static relationMappings = {
    quizOption: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuizOption,
      join: {
        from: "quiz_option_translation.quiz_option_id",
        to: "quiz_option.id",
      },
    },
  }
}

export default QuizOptionTranslation

import { Model } from "objection"
import Quiz from "./quiz"

class QuizTranslation extends Model {
  static get tableName() {
    return "quiz_translation"
  }
  static relationMappings = {
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "quiz_translation.quiz_id",
        to: "quiz.id",
      },
    }
  }
}

export default QuizTranslation

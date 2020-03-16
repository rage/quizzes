import { Model } from "objection"
import QuizItemAnswer from "./quiz_item"

class QuizAnswer extends Model {
  static get tableName() {
    return "quiz_answer"
  }
  static relationMappings = {
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
  }
}

export default QuizAnswer

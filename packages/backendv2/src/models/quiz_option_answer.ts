import { ModelObject } from "objection"
import BaseModel from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"

class QuizOptionAnswer extends BaseModel {
  id!: string
  quizOptionId!: string

  static get tableName() {
    return "quiz_option_answer"
  }
  static relationMappings = {
    quizItemAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_option_answer.quiz_item_answer_id",
        to: "quiz_item_answer.id",
      },
    },
  }
}

export type QuizOptionAnswerType = ModelObject<QuizOptionAnswer>

export default QuizOptionAnswer

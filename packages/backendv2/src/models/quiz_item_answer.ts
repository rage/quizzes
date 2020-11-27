import BaseModel from "./base_model"
import QuizAnswer from "./quiz_answer"
import QuizOptionAnswer from "./quiz_option_answer"

class QuizItemAnswer extends BaseModel {
  id!: string
  quizItemId!: string
  textData!: string
  correct!: boolean
  optionAnswers!: QuizOptionAnswer[]

  static get tableName() {
    return "quiz_item_answer"
  }

  static relationMappings = {
    quizAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "quiz_item_answer.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
    optionAnswers: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizOptionAnswer,
      join: {
        from: "quiz_item_answer.id",
        to: "quiz_option_answer.quiz_item_answer_id",
      },
    },
  }
}

export default QuizItemAnswer

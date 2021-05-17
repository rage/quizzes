import BaseModel from "./base_model"
import QuizAnswer from "./quiz_answer"
import QuizItem from "./quiz_item"
import QuizOptionAnswer from "./quiz_option_answer"

class QuizItemAnswer extends BaseModel {
  id!: string
  quizAnswer!: QuizAnswer
  quizItemId!: string
  quizItem!: QuizItem
  textData!: string
  correct!: boolean
  optionAnswers!: QuizOptionAnswer[]
  document!: any

  static get tableName() {
    return "quiz_item_answer"
  }

  static relationMappings = {
    quizAnswer: {
      relation: BaseModel.HasOneRelation,
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
    quizItem: {
      relation: BaseModel.HasOneRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz_item_answer.quiz_item_id",
        to: "quiz_item.id",
      },
    },
  }
}

export default QuizItemAnswer

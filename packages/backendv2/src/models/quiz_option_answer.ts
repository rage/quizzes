import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"

class QuizOptionAnswer extends Model {
  id!: string
  quizOptionId!: string

  static get tableName() {
    return "quiz_option_answer"
  }
  static relationMappings = {
    quizItemAnswer: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_option_answer.quiz_item_answer_id",
        to: "quiz_item_answer.id",
      },
    },
  }
}

export default QuizOptionAnswer

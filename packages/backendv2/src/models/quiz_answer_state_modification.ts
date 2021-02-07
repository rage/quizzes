import BaseModel from "./base_model"
import QuizAnswer from "./quiz_answer"
import User from "./user"

type StateModificationOperation =
  | "teacher-accept"
  | "teacher-reject"
  | "teacher-suspects-plagiarism"
  | "peer-review-accept"
  | "peer-review-reject"
  | "peer-review-spam"

class QuizAnswerStateModification extends BaseModel {
  id!: string
  quizAnswerId!: string
  modifierId!: number
  operation!: StateModificationOperation

  static get tableName() {
    return "quiz_answer_state_modification"
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer_state_modification.modifier_id",
        to: "user.id",
      },
    },
    quizAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "quiz_answer_state_modification.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
  }

  static async getAll() {
    const loggedChanges = await this.query()
    return loggedChanges
  }
}

export default QuizAnswerStateModification

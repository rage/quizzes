import BaseModel from "./base_model"

type StateModificationOperation =
  | "draft"
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

  static relationMappings = {}
}

export default QuizAnswerStateModification

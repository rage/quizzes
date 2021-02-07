import knex from "../../database/knex"
import { BadRequestError } from "../util/error"
import BaseModel from "./base_model"
import QuizAnswer from "./quiz_answer"
import User from "./user"

type StatusModificationOperation =
  | "teacher-accept"
  | "teacher-reject"
  | "teacher-suspects-plagiarism"
  | "peer-review-accept"
  | "peer-review-reject"
  | "peer-review-spam"

class QuizAnswerStatusModification extends BaseModel {
  id!: string
  quizAnswerId!: string
  modifierId!: number
  operation!: StatusModificationOperation

  static get tableName() {
    return "quiz_answer_status_modification"
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer_status_modification.modifier_id",
        to: "user.id",
      },
    },
    quizAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "quiz_answer_status_modification.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
  }

  static async getAll() {
    const loggedChanges = await this.query()
    return loggedChanges
  }

  static async logStatusChange(
    quizAnswerId: string,
    modifierId: number,
    operation: StatusModificationOperation,
  ): Promise<QuizAnswerStatusModification | BadRequestError> {
    console.log("logging change")
    const trx = await knex.transaction()
    try {
      const newQuizAnswerStatusChangeLog = await this.query(trx).insertAndFetch(
        this.fromJson({
          quizAnswerId,
          modifierId,
          operation,
        }),
      )

      await trx.commit()
      return newQuizAnswerStatusChangeLog
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }
}

export default QuizAnswerStatusModification

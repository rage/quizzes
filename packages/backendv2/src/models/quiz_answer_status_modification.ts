import Knex from "knex"
import {
  PlagStatusModificationOperation,
  TStatusModificationOperation,
} from "./../types/index"
import BaseModel from "./base_model"
import User from "./user"

class QuizAnswerStatusModification extends BaseModel {
  id!: string
  quizAnswerId!: string
  modifierId!: number
  operation!: TStatusModificationOperation
  plagiarismStatus!: PlagStatusModificationOperation

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
      modelClass: `${__dirname}/quiz_answer`,
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

  static async getAllByQuizAnswerId(
    quizAnswerId: string,
  ): Promise<QuizAnswerStatusModification[] | undefined> {
    return await this.query()
      .select("*")
      .where({ quiz_answer_id: quizAnswerId })
      .withGraphFetched("quizAnswer")
  }

  static async logStatusChange(
    quizAnswerId: string,
    operation: TStatusModificationOperation,
    plagiarismStatus: PlagStatusModificationOperation,
    trx: Knex.Transaction,
    modifierId?: number,
  ) {
    await this.query(trx).insert(
      this.fromJson({
        quizAnswerId,
        modifierId,
        operation,
        plagiarismStatus,
      }),
    )
  }

  static async logStatusChangeForMany(
    quizAnswerIds: [string],
    operation: TStatusModificationOperation,
    trx: Knex.Transaction,
    modifierId?: number,
  ) {
    const logsToInsert = quizAnswerIds.map(quizAnswerId => ({
      quizAnswerId,
      modifierId,
      operation,
    }))
    await this.query(trx).insert(logsToInsert)
  }
}

export default QuizAnswerStatusModification

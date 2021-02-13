import { TStatusModificationOperation } from "./../types/index"
import knex from "../../database/knex"
import { BadRequestError } from "../util/error"
import BaseModel from "./base_model"
import User from "./user"

class QuizAnswerStatusModification extends BaseModel {
  id!: string
  quizAnswerId!: string
  modifierId!: number
  operation!: TStatusModificationOperation

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
    modifierId?: number,
  ): Promise<QuizAnswerStatusModification | BadRequestError> {
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

import Knex from "knex"
import BaseModel from "./base_model"
import QuizAnswer from "./quiz_answer"

class PlagiarismSource extends BaseModel {
  id!: string
  targetAnswerId!: string
  sourceAnswerId!: number
  // verified: whether this has been confirmed by teacher to be a true match. Default false.
  // There is not yet a functionality to change this value
  verified!: boolean

  static get tableName() {
    return "plagiarism_source"
  }

  static relationMappings = {
    targetAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "plagiarism_source.target_answer_id",
        to: "quiz_answer.id",
      },
    },
    sourceAnswer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "plagiarism_source.source_answer_id",
        to: "quiz_answer.id",
      },
    },
  }

  static async getAll() {
    const allMatches = await this.query()
    return allMatches
  }

  static async getAllByTargetAnswerId(
    quizAnswerId: string,
  ): Promise<PlagiarismSource[] | undefined> {
    return await this.query()
      .select("*")
      .where({ target_answer_id: quizAnswerId })
      .withGraphFetched("sourceAnswer")
  }
}

export default PlagiarismSource

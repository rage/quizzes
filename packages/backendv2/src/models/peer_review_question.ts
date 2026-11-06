import { mixin } from "objection"

import BaseModel from "./base_model"
import PeerReviewCollection from "./peer_review_collection"
import PeerReviewQuestionTranslation from "./peer_review_question_translation"
import softDelete from "./soft_delete"

class PeerReviewQuestion extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
  id!: string
  texts!: PeerReviewQuestionTranslation[]
  collection!: PeerReviewCollection
  title!: string
  body!: string
  deleted!: boolean

  static get tableName() {
    return "peer_review_question"
  }

  static relationMappings = () => ({
    collection: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: PeerReviewCollection,
      join: {
        from: "peer_review_question.peer_review_collection_id",
        to: "peer_review_collection.id",
      },
    },
    texts: {
      relation: BaseModel.HasManyRelation,
      modelClass: PeerReviewQuestionTranslation,
      join: {
        from: "peer_review_question.id",
        to: "peer_review_question_translation.peer_review_question_id",
      },
    },
  })

  static async getById(id: string): Promise<PeerReviewQuestion | undefined> {
    return await this.query().findById(id)
  }
}
export default PeerReviewQuestion

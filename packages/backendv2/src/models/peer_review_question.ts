import BaseModel from "./base_model"
import PeerReviewCollection, {
  PeerReviewCollectionType,
} from "./peer_review_collection"
import PeerReviewQuestionTranslation, {
  PeerReviewQuestionTranslationType,
} from "./peer_review_question_translation"
import { mixin, ModelObject } from "objection"
import softDelete from "objection-soft-delete"

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

  static relationMappings = {
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
  }

  static async getById(id: string): Promise<PeerReviewQuestion> {
    return await this.query().findById(id)
  }
}

export type PeerReviewQuestionType = ModelObject<PeerReviewQuestion>

export default PeerReviewQuestion

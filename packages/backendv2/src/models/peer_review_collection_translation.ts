import { ModelObject } from "objection"
import BaseModel from "./base_model"
import PeerReviewCollection from "./peer_review_collection"

class PeerReviewCollectionTranslation extends BaseModel {
  title!: string
  body!: string

  static get tableName() {
    return "peer_review_collection_translation"
  }

  static get idColumn() {
    return ["peer_review_collection_id", "language_id"]
  }

  static relationMappings = {
    collection: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: PeerReviewCollection,
      join: {
        from: "peer_review_collection_translation.peer_review_collection_id",
        to: "peer_review_collection.id",
      },
    },
  }
}

export type PeerReviewCollectionTranslationType = ModelObject<
  PeerReviewCollectionTranslation
>

export default PeerReviewCollectionTranslation

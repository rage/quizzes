import { Model } from "objection"
import PeerReviewCollection from "./peer_review_collection"

class PeerReviewCollectionTranslation extends Model {
  static get tableName() {
    return "peer_review_collection_translation"
  }
  static relationMappings = {
    collection: {
      relation: Model.BelongsToOneRelation,
      modelClass: PeerReviewCollection,
      join: {
        from: "peer_review_collection_translation.peer_review_collection_id",
        to: "peer_review_collection.id",
      },
    },
  }
}

export default PeerReviewCollectionTranslation

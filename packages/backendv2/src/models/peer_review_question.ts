import Model from "./base_model"
import PeerReviewCollection from "./peer_review_collection"
import PeerReviewQuestionTranslation from "./peer_review_question_translation"

class PeerReviewQuestion extends Model {
  texts!: PeerReviewQuestionTranslation[]
  collection!: PeerReviewCollection
  title!: string
  body!: string

  static get tableName() {
    return "peer_review_question"
  }

  static relationMappings = {
    collection: {
      relation: Model.BelongsToOneRelation,
      modelClass: PeerReviewCollection,
      join: {
        from: "peer_review_question.peer_review_collection_id",
        to: "peer_review_collection.id",
      },
    },
    texts: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewQuestionTranslation,
      join: {
        from: "peer_review_question.id",
        to: "peer_review_question_translation.peer_review_question_id",
      },
    },
  }
}

export default PeerReviewQuestion

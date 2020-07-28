import Model from "./base_model"
import Quiz from "./quiz_item"
import PeerReviewCollectionTranslation from "./peer_review_collection_translation"
import PeerReviewQuestion from "./peer_review_question"

export class PeerReviewCollection extends Model {
  texts!: PeerReviewCollectionTranslation[]
  questions!: PeerReviewQuestion[]
  title!: string
  body!: string

  static get tableName() {
    return "peer_review_collection"
  }

  static relationMappings = {
    quiz: {
      relation: Model.HasOneRelation,
      modelClass: Quiz,
      join: {
        from: "peer_review_collection.quiz_id",
        to: "quiz.id",
      },
    },
    texts: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewCollectionTranslation,
      join: {
        from: "peer_review_collection.id",
        to: "peer_review_collection_translation.peer_review_collection_id",
      },
    },
    questions: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_collection.id",
        to: "peer_review_question.peer_review_collection_id",
      },
    },
  }
}

export default PeerReviewCollection

import { Model } from "objection"
import PeerReviewQuestion from "./peer_review_question"

class PeerReviewQuestionTranslation extends Model {
  static get tableName() {
    return "peer_review_question_translation"
  }
  static get idColumn() {
    return ["peer_review_question_id", "language_id"]
  }
  static relationMappings = {
    question: {
      relation: Model.BelongsToOneRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_question_translation.peer_review_question_id",
        to: "peer_review_question.id",
      },
    },
  }
}

export default PeerReviewQuestionTranslation

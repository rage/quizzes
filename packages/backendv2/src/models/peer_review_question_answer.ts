import Model from "./base_model"
import QuizAnswer from "./quiz_answer"
import PeerReview from "./peer_review"

class PeerReviewQuestionAnswer extends Model {
  static get tableName() {
    return "peer_review_question_answer"
  }

  static relationMappings = {
    peerReview: {
      relation: Model.BelongsToOneRelation,
      modelClass: PeerReview,
      join: {
        from: "peer_review_question_answer.peer_review_id",
        to: "peer_review.id",
      },
    },
  }
}

export default PeerReviewQuestionAnswer

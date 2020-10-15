import Model from "./base_model"
import PeerReview from "./peer_review"
import PeerReviewQuestion from "./peer_review_question"

class PeerReviewQuestionAnswer extends Model {
  value!: number
  question!: PeerReviewQuestion

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
    question: {
      relation: Model.BelongsToOneRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_question_answer.peer_review_question_id",
        to: "peer_review_question.id",
      },
    },
  }
}

export default PeerReviewQuestionAnswer

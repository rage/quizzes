import BaseModel from "./base_model"
import PeerReview from "./peer_review"
import PeerReviewQuestion from "./peer_review_question"

class PeerReviewQuestionAnswer extends BaseModel {
  value!: number
  question!: PeerReviewQuestion
  text!: string

  static get tableName() {
    return "peer_review_question_answer"
  }
  static get idColumn() {
    return ["peer_review_id", "peer_review_question_id"]
  }

  static relationMappings = {
    peerReview: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: PeerReview,
      join: {
        from: "peer_review_question_answer.peer_review_id",
        to: "peer_review.id",
      },
    },
    question: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_question_answer.peer_review_question_id",
        to: "peer_review_question.id",
      },
    },
  }
}

export default PeerReviewQuestionAnswer

import Model from "./base_model"
import QuizAnswer from "./quiz_answer"
import PeerReviewQuestionAnswer from "./peer_review_question_answer"

class PeerReview extends Model {
  answers!: PeerReviewQuestionAnswer[]

  static get tableName() {
    return "peer_review"
  }

  static relationMappings = {
    quizAnswer: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuizAnswer,
      join: {
        from: "peer_review.quiz_answer_id",
        to: "quiz_answer.id",
      },
    },
    answers: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewQuestionAnswer,
      join: {
        from: "peer_review.id",
        to: "peer_review_question_answer.peer_review_id",
      },
    },
  }
}

export default PeerReview

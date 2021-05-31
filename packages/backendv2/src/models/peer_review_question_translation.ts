import { ModelObject } from "objection"
import BaseModel from "./base_model"
import PeerReviewQuestion from "./peer_review_question"

class PeerReviewQuestionTranslation extends BaseModel {
  title!: string
  body!: string
  peerReviewQuestionId!: string
  languageId!: string
  createdAt!: string
  updatedAt!: string

  static get tableName() {
    return "peer_review_question_translation"
  }

  static get idColumn() {
    return ["peer_review_question_id", "language_id"]
  }

  static relationMappings = {
    question: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_question_translation.peer_review_question_id",
        to: "peer_review_question.id",
      },
    },
  }
}

export type PeerReviewQuestionTranslationType = ModelObject<
  PeerReviewQuestionTranslation
>
export default PeerReviewQuestionTranslation

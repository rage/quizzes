import Quiz from "./quiz_item"
import PeerReviewCollectionTranslation from "./peer_review_collection_translation"
import PeerReviewQuestion from "./peer_review_question"
import BaseModel from "./base_model"
import { mixin } from "objection"
import softDelete from "objection-soft-delete"

export class PeerReviewCollection extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
  id!: string
  texts!: PeerReviewCollectionTranslation[]
  questions!: PeerReviewQuestion[]
  title!: string
  body!: string
  deleted!: boolean

  static get tableName() {
    return "peer_review_collection"
  }

  static relationMappings = {
    quiz: {
      relation: BaseModel.HasOneRelation,
      modelClass: Quiz,
      join: {
        from: "peer_review_collection.quiz_id",
        to: "quiz.id",
      },
    },
    texts: {
      relation: BaseModel.HasManyRelation,
      modelClass: PeerReviewCollectionTranslation,
      join: {
        from: "peer_review_collection.id",
        to: "peer_review_collection_translation.peer_review_collection_id",
      },
    },
    questions: {
      relation: BaseModel.HasManyRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "peer_review_collection.id",
        to: "peer_review_question.peer_review_collection_id",
      },
    },
  }

  static async getById(id: string): Promise<PeerReviewCollection> {
    return await this.query().findById(id);
  }
}

export default PeerReviewCollection

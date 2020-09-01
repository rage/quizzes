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

  // static async getPeerReviewQuestionsByQuizId(quizId: string) {
  //   const questions: PeerReviewQuestion[] = await this.query()
  //     .select("*")
  //     .withGraphFetched("texts")
  //     .where("quiz_id", quizId)

  //   return PeerReviewQuestion.moveTextsToParent(questions)
  // }

  // private static moveTextsToParent(questions: PeerReviewQuestion[]) {
  //   return questions.map(question => {
  //     const moddedQuestion: any = question
  //     moddedQuestion.peerReviewQuestionId =
  //       question.texts[0].peerReviewQuestionId
  //     moddedQuestion.languageId = question.texts[0].languageId
  //     moddedQuestion.title = question.texts[0].title
  //     moddedQuestion.body = question.texts[0].body
  //     moddedQuestion.createdAt = question.texts[0].createdAt
  //     moddedQuestion.updatedAt = question.texts[0].updatedAt
  //     delete moddedQuestion.texts
  //     return moddedQuestion
  //   })
  // }
}

export default PeerReviewQuestion

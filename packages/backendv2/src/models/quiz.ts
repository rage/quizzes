import Model from "./base_model"
import QuizItem from "./quiz_item"
import QuizTranslation from "./quiz_translation"
import PeerReviewCollection from "./peer_review_collection"
import Course from "./course"
import { NotFoundError } from "../util/error"

export class Quiz extends Model {
  texts!: QuizTranslation[]
  items!: QuizItem[]
  peerReviews!: PeerReviewCollection[]
  title!: string
  body!: string
  submitMessage!: string

  static get tableName() {
    return "quiz"
  }

  static relationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: QuizItem,
      join: {
        from: "quiz.id",
        to: "quiz_item.quiz_id",
      },
    },
    texts: {
      relation: Model.HasManyRelation,
      modelClass: QuizTranslation,
      join: {
        from: "quiz.id",
        to: "quiz_translation.quiz_id",
      },
    },
    peerReviews: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewCollection,
      join: {
        from: "quiz.id",
        to: "peer_review_collection.quiz_id",
      },
    },
    course: {
      relation: Model.HasOneRelation,
      modelClass: Course,
      join: {
        from: "quiz.course_id",
        to: "course.id",
      },
    },
  }

  static get modifiers() {
    return {
      previewSelect: (query: any) => {
        query.select("texts")
      },
    }
  }

  static async saveQuiz(data: any) {
    const quiz = data
    const course = (await Course.getById(quiz.courseId))[0]
    const languageId = course.texts[0].languageId
    quiz.texts = [
      {
        quizId: quiz.id,
        languageId,
        title: quiz.title,
        body: quiz.body,
        submitMessage: quiz.submitMessage,
      },
    ]
    delete quiz.title
    delete quiz.body
    delete quiz.submitMessage
    quiz.items?.forEach((item: any) => {
      item.texts = [
        {
          quizItemId: item.id,
          languageId,
          title: item.title,
          body: item.body,
          successMessage: item.successMessage,
          failureMessage: item.failureMessage,
          sharedOptionFeedbackMessage: item.sharedOptionFeedbackMessage,
        },
      ]
      delete item.title
      delete item.body
      delete item.successMessage
      delete item.failureMessage
      delete item.sharedOptionFeedbackMessage
      item.options?.forEach((option: any) => {
        option.texts = [
          {
            quizOptionId: option.id,
            languageId,
            title: option.title,
            body: option.body,
            successMessage: option.successMessage,
            failureMessage: option.failureMessage,
          },
        ]
        delete option.title
        delete option.body
        delete option.successMessage
        delete option.failureMessage
      })
    })

    quiz.peerReviews?.forEach((peerReviewCollection: any) => {
      peerReviewCollection.texts = [
        {
          peerReviewCollectionId: peerReviewCollection.id,
          languageId,
          title: peerReviewCollection.title,
          body: peerReviewCollection.body,
        },
      ]
      delete peerReviewCollection.title
      delete peerReviewCollection.body
      peerReviewCollection.questions?.forEach((peerReviewQuestion: any) => {
        peerReviewQuestion.texts = [
          {
            peerReviewQuestionId: peerReviewQuestion.id,
            languageId,
            title: peerReviewQuestion.title,
            body: peerReviewQuestion.body,
          },
        ]
        delete peerReviewQuestion.title
        delete peerReviewQuestion.body
      })
    })

    return this.moveTextsToParent(await Quiz.query().upsertGraphAndFetch(quiz))
  }

  static async getById(quizId: string) {
    const quiz = (
      await this.query()
        .withGraphJoined("texts")
        .withGraphJoined("items.[texts, options.[texts]]")
        .withGraphJoined("peerReviews.[texts, questions.[texts]]")
        .where("quiz.id", quizId)
    )[0]

    if (!quiz) {
      throw new NotFoundError(`quiz not found: ${quizId}`)
    }

    return this.moveTextsToParent(quiz)
  }

  static async getPreviewById(quizId: string) {
    const quiz = (
      await this.query()
        .modify("previewSelect")
        .withGraphJoined("texts(previewSelect)")
        .where("quiz.id", quizId)
    )[0]
    if (!quiz) {
      throw new NotFoundError(`quiz not found: ${quizId}`)
    }
    return quiz
  }

  static async getByCourseId(courseId: string) {
    return (
      await this.query()
        .withGraphJoined("texts")
        .withGraphJoined("items.[texts, options.[texts]]")
        .withGraphJoined("peerReviews.[texts, questions.[texts]]")
        .where("quiz.course_id", courseId)
    ).map(quiz => this.moveTextsToParent(quiz))
  }

  private static moveTextsToParent(quiz: any) {
    const text = quiz.texts[0]
    quiz.title = text?.title
    quiz.body = text?.body
    quiz.submitMessage = text?.submitMessage
    delete quiz.texts
    quiz.items = quiz.items?.map((item: any) => {
      const text = item.texts[0]
      item.title = text?.title
      item.body = text?.body
      item.successMessage = text?.successMessage
      item.failureMessage = text?.failureMessage
      item.sharedOptionFeedbackMessage = text?.sharedOptionFeedbackMessage
      delete item.texts
      item.options = item.options?.map((option: any) => {
        const text = option.texts[0]
        option.title = text?.title
        option.body = text?.body
        option.successMessage = text?.successMessage
        option.failureMessage = text?.failureMessage
        delete option.texts
        return option
      })
      return item
    })
    quiz.peerReviews = quiz.peerReviews?.map((prc: any) => {
      prc.questions = prc.questions?.map((prq: any) => {
        const text = prq.texts[0]
        prq.title = text?.title
        prq.body = text?.body
        delete prq.texts
        return prq
      })
      const text = prc.texts[0]
      prc.title = text?.title
      prc.body = text?.body
      delete prc.texts
      return prc
    })
    return quiz
  }
}

export default Quiz

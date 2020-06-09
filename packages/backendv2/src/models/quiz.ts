import Model from "./base_model"
import QuizItem from "./quiz_item"
import QuizTranslation from "./quiz_translation"
import PeerReviewCollection from "./peer_review_collection"
import Course from "./course"
import { NotFoundError } from "../util/error"

export class Quiz extends Model {
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
    return await Quiz.query().upsertGraphAndFetch(data)
  }

  static async getQuizById(quizId: string) {
    const quiz = (
      await this.query()
        .withGraphJoined("texts")
        .withGraphJoined("items.[texts, options.[texts]]")
        .withGraphJoined("peerReviews.[texts, questions.[texts]]")
        .withGraphJoined("course.[texts]")
        .where("quiz.id", quizId)
    )[0]
    if (!quiz) {
      throw new NotFoundError(`quiz not found: ${quizId}`)
    }
    return quiz
  }

  static async getQuizPreviewById(quizId: string) {
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

  static async getQuizzesByCourseId(courseId: string) {
    return await this.query()
      .withGraphJoined("texts")
      .withGraphJoined("items.[texts, options.[texts]]")
      .withGraphJoined("peerReviews.[texts, questions.[texts]]")
      .withGraphJoined("course.[texts]")
      .where("quiz.course_id", courseId)
  }
}

export default Quiz

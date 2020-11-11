import Model from "./base_model"
import QuizItem from "./quiz_item"
import QuizTranslation from "./quiz_translation"
import PeerReviewCollection from "./peer_review_collection"
import Course from "./course"
import { NotFoundError } from "../util/error"
import moduleInitializer from "../util/initializer"
import stringify from "csv-stringify"
import QuizAnswer from "./quiz_answer"
import knex from "../../database/knex"
import { BadRequestError } from "../util/error"
import Knex from "knex"
import UserQuizState from "./user_quiz_state"
import * as Kafka from "../services/kafka"
import PeerReviewQuestion from "./peer_review_question"

export class Quiz extends Model {
  id!: string
  courseId!: string
  part!: number
  section!: number
  points!: number
  deadline!: Date
  triesLimited!: boolean
  tries!: number
  excludedFromScore!: boolean
  awardPointsEvenIfWrong!: boolean
  autoConfirm!: boolean
  autoReject!: boolean
  course!: Course
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
    answers: {
      relation: Model.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: "quiz.id",
        to: "quiz_answer.quiz_id",
      },
    },
    userQuizStates: {
      relation: Model.HasManyRelation,
      modelClass: UserQuizState,
      join: {
        from: "quiz.id",
        to: "user_quiz_state.quiz_id",
      },
    },
    peerReviewQuestions: {
      relation: Model.HasManyRelation,
      modelClass: PeerReviewQuestion,
      join: {
        from: "quiz.id",
        to: "peer_review_question.quiz_id",
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

  static async save(data: any) {
    const quiz = data
    const course = await Course.getById(quiz.courseId)
    const languageId = course.languageId
    quiz.texts = [
      QuizTranslation.fromJson({
        quizId: quiz.id,
        languageId,
        title: quiz.title,
        body: quiz.body,
        submitMessage: quiz.submitMessage,
      }),
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

    const trx = await knex.transaction()
    let savedQuiz
    try {
      const oldQuiz = quiz.id
        ? await this.query(trx).findById(quiz.id)
        : undefined
      if (oldQuiz) {
        await this.query(trx).upsertGraph(quiz)
        savedQuiz = await this.query(trx)
          .findById(quiz.id)
          .withGraphJoined("texts")
          .withGraphJoined("items.[texts, options.[texts]]")
          .withGraphJoined("peerReviews.[texts, questions.[texts]]")
      } else {
        savedQuiz = await this.query(trx).insertGraphAndFetch(quiz)
      }
      await this.updateCourseProgressesIfNecessary(oldQuiz, savedQuiz, trx)
      await Kafka.broadcastCourseQuizzesUpdated(course.id, trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw new BadRequestError(error)
    }
    return this.moveTextsToParent(savedQuiz)
  }

  private static async updateCourseProgressesIfNecessary(
    oldQuiz: Quiz | undefined,
    newQuiz: Quiz,
    trx: Knex.Transaction,
  ) {
    if (!oldQuiz) {
      return
    }
    const shouldUpdate =
      oldQuiz.points !== newQuiz.points || oldQuiz.part !== newQuiz.part
    if (shouldUpdate) {
      await UserQuizState.updateAwardedPointsForQuiz(oldQuiz, newQuiz, trx)
      await Kafka.setTaskToUpdateAndBroadcast(oldQuiz.courseId, trx)
    }
  }

  static async getById(quizId: string, trx?: Knex.Transaction) {
    const quiz = (
      await this.query(trx)
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

  static async getByIdStripped(quizId: string) {
    const quiz = await this.getById(quizId)
    delete quiz.submitMessage
    for (const quizItem of quiz.items) {
      delete quizItem.successMessage
      delete quizItem.failureMessage
      delete quizItem.sharedOptionFeedbackMessage
      delete quizItem.validityRegex
      for (const quizOption of quizItem.options) {
        delete quizOption.successMessage
        delete quizOption.failureMessage
        delete quizOption.correct
      }
    }
    return quiz
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

  static async getQuizInfo(quizId: string) {
    await moduleInitializer()

    const stringifier = stringify({
      delimiter: ",",
      quoted: true,
      header: true,
    })

    const stream = this.query()
      .withGraphJoined("texts")
      .withGraphJoined("items.[texts, options.[texts]]")
      .withGraphJoined("peerReviews.[texts, questions.[texts]]")
      .where("quiz.id", quizId)
      .toKnexQuery()
      .stream()
      .pipe(stringifier)

    return stream
  }

  static async getPeerReviewInfo(quizId: string) {
    await moduleInitializer()

    const stringifier = stringify({
      delimiter: ",",
      quoted: true,
      header: true,
    })

    const stream = this.query()
      .withGraphJoined("peerReviews.[texts, questions.[texts]]")
      .where("quiz.id", quizId)
      .toKnexQuery()
      .stream()
      .pipe(stringifier)

    return stream
  }

  static async getQuizAnswerInfo(quizId: string) {
    await moduleInitializer()

    const stringifier = stringify({
      delimiter: ",",
      quoted: true,
      header: true,
    })

    const stream = this.query()
      .withGraphJoined("answers.[itemAnswers.[optionAnswers]]")
      .where("quiz.id", quizId)
      .toKnexQuery()
      .stream()
      .pipe(stringifier)

    return stream
  }

  private static moveTextsToParent(quiz: Quiz) {
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

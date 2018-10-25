import {
  Course,
  PeerReviewQuestion,
  Quiz,
  QuizItem,
  QuizTranslation,
  QuizItemTranslation,
  QuizOption,
  QuizOptionTranslation,
  PeerReviewQuestionTranslation,
} from "@quizzes/common/models"
import {
  INewQuizQuery,
  IQuizQuery,
  INewQuizTranslation,
  INewQuizItem,
  INewQuizItemTranslation,
  INewQuizOption,
  INewQuizOptionTranslation,
  INewPeerReviewQuestion,
} from "@quizzes/common/types"
import { getUUIDByString, insert, randomUUID } from "@quizzes/common/util"
import _ from "lodash"
import { InsertResult, SelectQueryBuilder, PromiseUtils } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import quizanswerService from "./quizanswer.service"

export class QuizService {
  public static getInstance(): QuizService {
    if (!this.instance) {
      this.instance = new this()
    }

    return this.instance
  }

  private static instance: QuizService

  public async getQuizzes(query: IQuizQuery): Promise<Quiz[]> {
    const { id, course, language, items, options, peerreviews } = query

    const queryBuilder: SelectQueryBuilder<Quiz> = Quiz.createQueryBuilder(
      "quiz",
    )

    if (id) {
      queryBuilder.where("quiz.id = :id", { id })
    }

    if (course) {
      queryBuilder.leftJoinAndSelect("quiz.course", "course")

      if (language) {
        queryBuilder
          .leftJoinAndSelect("course.languages", "language")
          .where("language.id = :language", { language })
      }
    }

    queryBuilder.leftJoinAndSelect("quiz.texts", "quiz_translation")

    if (language) {
      queryBuilder.where("quiz_translation.language_id = :language", {
        language,
      })
    }

    if (items) {
      queryBuilder
        .leftJoinAndSelect("quiz.items", "quiz_item")
        .leftJoinAndSelect("quiz_item.texts", "quiz_item_translation")

      if (language) {
        queryBuilder.where("quiz_item_translation.language_id = :language", {
          language,
        })
      }
    }

    if (items && options) {
      queryBuilder
        .leftJoinAndSelect("quiz_item.options", "quiz_option")
        .leftJoinAndSelect("quiz_option.texts", "quiz_option_translation")

      if (language) {
        queryBuilder.where("quiz_option_translation.language_id = :language", {
          language,
        })
      }
    }

    if (peerreviews) {
      queryBuilder
        .leftJoinAndSelect("quiz.peerReviewQuestions", "peer_review_question")
        .leftJoinAndSelect(
          "peer_review_question.texts",
          "peer_review_question_translation",
        )

      if (language) {
        queryBuilder.where(
          "peer_review_question_translation.language_id = :language",
          { language },
        )
      }
    }

    const res = await queryBuilder.getMany()

    return Promise.all(
      res.map(async (quiz: Quiz) => {
        if (quiz.items) {
          quiz.items = PromiseUtils.extractValue(quiz.items)
          console.log(quiz.items)
        }
        return quiz
      }),
    )
    // return await queryBuilder.getMany()
  }

  public async createQuiz(query: INewQuizQuery): Promise<Quiz> {
    const course: Course = await Course.findOne(
      query.courseId || getUUIDByString("default"),
    )

    const newQuiz: Quiz = new Quiz({ ...query, id: randomUUID() })
    const savedQuiz = await newQuiz.save()

    if (savedQuiz.items) {
      const items: QuizItem[] = await savedQuiz.items

      items.map(async item => {
        const savedItem = await item.save()

        if (savedItem.options) {
          const options: QuizOption[] = await item.options

          options.map(option => option.save())
        }
      })
    }

    return savedQuiz
  }

  public async updateQuiz(quiz: Quiz): Promise<Quiz> {
    return await Quiz.save(quiz)
  }

  public async deleteQuiz(id: string): Promise<boolean> {
    try {
      await Quiz.delete({ id })

      return true
    } catch {
      return false
    }
  }
}

export default { QuizService }

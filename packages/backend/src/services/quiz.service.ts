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
import { getUUIDByString, insert } from "@quizzes/common/util"
import _ from "lodash"
import { InsertResult, SelectQueryBuilder } from "typeorm"
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

    if (language) {
      queryBuilder
        .leftJoinAndSelect("quiz.texts", "quiz_translation")
        .where("quiz_translation.language_id = :language", { language })
    }

    if (items) {
      queryBuilder.leftJoinAndSelect("quiz.items", "quiz_item")

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "quiz_item.texts",
          "quiz_item_translation",
          "quiz_item_translation.language_id = :language",
          { language },
        )
      }
    }

    if (items && options) {
      queryBuilder.leftJoinAndSelect("quiz_item.options", "quiz_option")

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "quiz_option.texts",
          "quiz_option_translation",
          "quiz_option_translation.language_id = :language",
          { language },
        )
      }
    }

    if (peerreviews) {
      queryBuilder.leftJoinAndSelect(
        "quiz.peerReviewQuestions",
        "peer_review_question",
      )

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "peer_review_question.texts",
          "peer_review-question_translation",
          "peer_review_question_Translation.language_id = :language",
          { language },
        )
      }
    }

    return await queryBuilder.getMany()
  }

  public async createQuiz(query: INewQuizQuery): Promise<Quiz> {
    const course: Course = await Course.findOne(
      query.courseId || getUUIDByString("default"),
    )

    const newQuiz: Quiz = new Quiz(query)
    /*     const quizQuery: QueryPartialEntity<Quiz> = {
      course,
      part: query.part,
      section: query.section,
      excludedFromScore: query.excludedFromScore,
    }

    const newQuiz: Quiz = await insert(Quiz, [quizQuery])
      .then((res: InsertResult) => _.get(res, "generatedMaps[0]"))


    const quizTranslations: Array<QueryPartialEntity<QuizTranslation>> =
      _.get(query, "texts", [] as INewQuizTranslation[]).map((text: INewQuizTranslation) => ({
        quizId: newQuiz.id,
        languageId: text.languageId,
        title: text.title,
        body: text.body,
        submitMessage: text.submitMessage
      }))

    const items: Array<QueryPartialEntity<QuizItem>> = []
    const itemTranslations: Array<QueryPartialEntity<QuizItemTranslation>> = []
    const options: Array<QueryPartialEntity<QuizOption>> = []
    const optionTranslations: Array<QueryPartialEntity<QuizOptionTranslation>> = []
    const peerreviews: Array<QueryPartialEntity<PeerReviewQuestion>> = []
    const peerreviewTranslations: Array<QueryPartialEntity<PeerReviewQuestionTranslation>> = []

    // todo (?) peer review collection

    // if...
    const newItems: QuizItem[] = await Promise.all(
      _.get(query, "items", [] as INewQuizItem[]).map(async (item: INewQuizItem) => {
      const itemQuery: QueryPartialEntity<QuizItem> = {
        quizId: newQuiz.id,
        type: item.type,
        order: item.order,
        validityRegex: item.validityRegex,
        formatRegex: item.formatRegex
      }

      const newItem: QuizItem = await insert(QuizItem, [itemQuery])
        .then((res: InsertResult) => _.get(res, "generatedMaps[0]"))

      _.get(item, "texts", [] as INewQuizItemTranslation[]).forEach((text: INewQuizItemTranslation) => {
        const newItemTranslation: QueryPartialEntity<QuizItemTranslation> = {
          quizItemId: newItem.id,
          languageId: text.languageId,
          title: text.title,
          body: text.body,
          successMessage: text.successMessage,
          failureMessage: text.failureMessage
        }

        itemTranslations.push(newItemTranslation)
      })

      const newOptions: QuizOption[] = await Promise.all(
        _.get(item, "options", [] as INewQuizOption[]).map(async (option: INewQuizOption) => {
        const optionQuery: QueryPartialEntity<QuizOption> = {
          quizItemId: newItem.id,
          order: option.order,
          correct: option.correct
        }

        const newOption: QuizOption = await insert(QuizOption, [optionQuery])
          .then((res: InsertResult) => _.get(res, "generatedMaps[0]"))

        _.get(option, "texts", [] as INewQuizOptionTranslation[]).forEach((text: INewQuizOptionTranslation) => {
          const newOptionTranslation: QueryPartialEntity<QuizOptionTranslation> = {
            quizOptionId: newOption.id,
            languageId: text.languageId,
            successMessage: text.successMessage,
            failureMessage: text.failureMessage,
            title: text.title,
            body: text.body
          }

          optionTranslations.push(newOptionTranslation)
        })

        return newOption // push partial
      }))

      return newItem // push partial
    }))

    // todo: next...?

    console.log("quiz", newQuiz)
    console.log("translations", quizTranslations)
    console.log("items", items)
    console.log("itemtranslations", itemTranslations),
    console.log("options", options)
    console.log("optiontranslations", optionTranslations)

    await insert(QuizTranslation, quizTranslations, `"quiz_id", "language_id"`)
    // await insert(QuizItem, items)
    await insert(QuizItemTranslation, itemTranslations, `"quiz_item_id", "language_id"`)
    // await insert(QuizOption, options)
    await insert(QuizOptionTranslation, optionTranslations, `"quiz_option_id", "language_id"`)

    return await Quiz.findOne(newQuiz.id) */

    // not saved yet
    return await newQuiz.save()
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

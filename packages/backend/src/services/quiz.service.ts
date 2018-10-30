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
import {
  InsertResult,
  SelectQueryBuilder,
  PromiseUtils,
  BaseEntity,
} from "typeorm"
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

    console.log("got query", query)
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
      console.log("should not get here")
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

    return await queryBuilder.getMany()
  }

  public async createQuiz(quiz: Quiz): Promise<Quiz> {
    /*     const course: Course = await Course.findOne(
      quiz.courseId || getUUIDByString("default"),
    )

    await course */

    let newQuiz: Quiz

    if (quiz.id) {
      newQuiz = await Quiz.findOne({ id: quiz.id })
    }

    console.log("quizservice got", quiz)

    if (!newQuiz) {
      newQuiz = new Quiz(quiz)
      newQuiz = await newQuiz.save()
    } else {
      // todo: assign actual types
      console.log("before", newQuiz)
      newQuiz = Object.assign(newQuiz, quiz)
      console.log("after", newQuiz)

      newQuiz = await newQuiz.save()
    }

    if (newQuiz.items) {
      newQuiz.items = await Promise.all(
        newQuiz.items.map(async (item: QuizItem) => {
          const newItem: QuizItem = new QuizItem(item)

          if (item.texts) {
            newItem.texts = await Promise.all(
              item.texts.map(async (text: QuizItemTranslation) => {
                const newTranslation: QuizItemTranslation = new QuizItemTranslation(
                  text,
                )
                text = await newTranslation.save()

                return text
              }),
            )
          }

          if (item.options) {
            newItem.options = await Promise.all(
              item.options.map(async (option: QuizOption) => {
                const newOption: QuizOption = new QuizOption(option)

                if (option.texts) {
                  newOption.texts = await Promise.all(
                    option.texts.map(async (text: QuizOptionTranslation) => {
                      const newTranslation: QuizOptionTranslation = new QuizOptionTranslation(
                        text,
                      )
                      text = await newTranslation.save()

                      return text
                    }),
                  )
                }

                option = await newOption.save()

                return option
              }),
            )
          }

          return await newItem.save()
        }),
      )
    }

    return await newQuiz
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

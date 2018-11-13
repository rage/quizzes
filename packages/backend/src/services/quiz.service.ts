import db, { Database } from "@quizzes/common/config/database"
import {
  Course,
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  Quiz,
  QuizItem,
  QuizItemTranslation,
  QuizOption,
  QuizOptionTranslation,
  QuizTranslation,
} from "@quizzes/common/models"
import {
  INewPeerReviewQuestion,
  INewQuizItem,
  INewQuizItemTranslation,
  INewQuizOption,
  INewQuizOptionTranslation,
  INewQuizQuery,
  INewQuizTranslation,
  IQuizQuery,
} from "@quizzes/common/types"
import { getUUIDByString, insert, randomUUID } from "@quizzes/common/util"
import _ from "lodash"
import { Service, Container } from "typedi"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  BaseEntity,
  Brackets,
  EntityManager,
  getManager,
  InsertResult,
  PromiseUtils,
  SelectQueryBuilder,
  TransactionManager,
  AdvancedConsoleLogger,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import quizanswerService from "./quizanswer.service"

@Service()
export class QuizService {
  @InjectManager()
  private entityManager: EntityManager

  public async getQuizzes(query: IQuizQuery): Promise<Quiz[]> {
    const { id, course, language, items, options, peerreviews } = query

    const queryBuilder: SelectQueryBuilder<
      Quiz
    > = this.entityManager.createQueryBuilder(Quiz, "quiz")

    queryBuilder.leftJoinAndSelect("quiz.texts", "quiz_translation")

    if (id) {
      console.log(id)
      queryBuilder.where("quiz.id = :id", { id })
      console.log("after id", queryBuilder.getQuery())
    }

    if (language) {
      console.log("language")
      queryBuilder.andWhere("quiz_translation.language_id = :language", {
        language,
      })
      console.log("after language", queryBuilder.getQuery())
    }

    if (course) {
      queryBuilder.leftJoinAndSelect("quiz.course", "course")

      if (language) {
        queryBuilder
          .leftJoinAndSelect("course.languages", "language")
          .andWhere("language.id = :language", { language })
      }
    }

    if (items) {
      queryBuilder
        .leftJoinAndSelect("quiz.items", "quiz_item")
        .leftJoinAndSelect("quiz_item.texts", "quiz_item_translation")

      if (language) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("quiz_item_translation.language_id = :language", {
              language,
            }).orWhere("quiz_item_translation.language_id is null")
          }),
        )
      }
    }

    if (items && options) {
      queryBuilder
        .leftJoinAndSelect("quiz_item.options", "quiz_option")
        .leftJoinAndSelect("quiz_option.texts", "quiz_option_translation")

      if (language) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("quiz_option_translation.language_id = :language", {
              language,
            }).orWhere("quiz_option_translation.language_id is null")
          }),
        )
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
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where(
              "peer_review_question_translation.language_id = :language",
              { language },
            ).orWhere("peer_review_question_translation is null")
          }),
        )
      }
    }

    console.log(queryBuilder.getQuery())

    return await queryBuilder
      .getMany()
      .then(
        async (quizzes: Quiz[]) =>
          await Promise.all(
            quizzes.map(async (q: Quiz) => this.stripQuiz(q, query)),
          ),
      )
  }

  public async createQuiz(quiz: Quiz): Promise<Quiz> {
    const newQuiz: Quiz = await this.entityManager.save(quiz)

    if (newQuiz) {
      // test: ^ does not always return all?
      const updatedQuiz: Quiz[] = await Quiz.find({ id: newQuiz.id })

      return updatedQuiz[0]
    }

    /*     if (quiz.id) {
      newQuiz = await Quiz.findOne({ id: quiz.id })
      newQuiz = Object.assign({}, newQuiz, quiz) // TODO: better update
    } */

    /*     console.log("quizservice got", newQuiz)

    try {
      await this.entityManager.transaction(async tem => {
        newQuiz = new Quiz(newQuiz)

        newQuiz.items = await Promise.all(
          // these don't necessarily need promises
          (newQuiz.items || []).map(async item => {
            const newItem: QuizItem = new QuizItem(item)

            newItem.texts = (newItem.texts || []).map(
              text => new QuizItemTranslation(text),
            )
            newItem.options = await Promise.all(
              (newItem.options || []).map(async option => {
                const newOption: QuizOption = new QuizOption(option)

                newOption.texts = (newOption.texts || []).map(
                  text => new QuizOptionTranslation(text),
                )

                return newOption
              }),
            )

            return newItem
          }),
        )

        newQuiz = await tem.save(newQuiz)
      })
    } catch (err) {
      return null
    }

    await newQuiz.course

    return await newQuiz */
    return newQuiz
  }

  public async updateQuiz(quiz: Quiz): Promise<Quiz> {
    return await this.entityManager.save(quiz)
  }

  public async deleteQuiz(id: string): Promise<boolean> {
    try {
      await this.entityManager.delete(Quiz, { id })

      return true
    } catch {
      return false
    }
  }

  private async stripQuiz(quiz: Quiz, options: IQuizQuery): Promise<Quiz> {
    await quiz.course

    if (options.language) {
      quiz.texts = quiz.texts.filter(t => t.languageId === options.language)
    }

    if (options.items) {
      if (!options.options) {
        quiz.items.forEach(item => {
          item.options = []
        })
      }

      if (options.language) {
        quiz.items.forEach(item => {
          item.texts = item.texts.filter(t => t.languageId === options.language)
          item.options.forEach(
            option =>
              (option.texts = option.texts.filter(
                t => t.languageId === options.language,
              )),
          )
        })
      }
    } else {
      quiz.items = []
    }

    return await quiz
  }
}

export default QuizService

import db, { Database } from "@quizzes/common/config/database"
import {
  Course,
  PeerReviewQuestion,
  PeerReviewQuestionCollection,
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
import {
  getUUIDByString,
  insert,
  randomUUID,
  WhereBuilder,
} from "@quizzes/common/util"
import _ from "lodash"
import { Service } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import quizanswerService from "./quizanswer.service"

@Service()
export default class QuizService {
  @InjectManager()
  private entityManager: EntityManager

  public async getQuizzes(query: IQuizQuery): Promise<Quiz[]> {
    const queryBuilder = this.entityManager.createQueryBuilder(Quiz, "quiz")
    const { courseId, exclude, id, language, stripped } = query

    if (language) {
      queryBuilder.leftJoinAndSelect(
        "quiz.texts",
        "quiz_translation",
        "quiz_translation.language_id = :language",
        { language },
      )
    } else {
      queryBuilder.leftJoinAndSelect("quiz.texts", "quiz_translation")
    }

    if (query.course) {
      queryBuilder
        .leftJoinAndSelect("quiz.course", "course")
        .leftJoinAndSelect("course.languages", "language")
      if (language) {
        queryBuilder.leftJoinAndSelect(
          "course.texts",
          "course_translation",
          "course_translation.language_id = :language",
          { language },
        )
      } else {
        queryBuilder.leftJoinAndSelect("course.texts", "course_translation")
      }
    }

    if (query.items) {
      queryBuilder.leftJoinAndSelect("quiz.items", "item")
      if (language) {
        queryBuilder.leftJoinAndSelect(
          "item.texts",
          "item_translation",
          "item_translation.language_id = :language",
          { language },
        )
      } else {
        queryBuilder.leftJoinAndSelect("item.texts", "item_translation")
      }
      if (!stripped) {
        queryBuilder
          .addSelect("item.validityRegex")
          .addSelect("item_translation.successMessage")
          .addSelect("item_translation.failureMessage")
      }
    }

    if (query.options) {
      queryBuilder.leftJoinAndSelect("item.options", "option")
      if (language) {
        queryBuilder.leftJoinAndSelect(
          "option.texts",
          "option_translation",
          "option_translation.language_id = :language",
          { language },
        )
      } else {
        queryBuilder.leftJoinAndSelect("option.texts", "option_translation")
      }
      if (!stripped) {
        queryBuilder
          .addSelect("option.correct")
          .addSelect("option_translation.successMessage")
          .addSelect("option_translation.failureMessage")
      }
    }

    if (query.peerreviews) {
      queryBuilder
        .leftJoinAndSelect(
          "quiz.peerReviewQuestionCollections",
          "peer_review_question_collection",
        )
        .leftJoinAndSelect(
          "peer_review_question_collection.questions",
          "peer_review_question",
        )
      if (language) {
        queryBuilder
          .leftJoinAndSelect(
            "peer_review_question_collection.texts",
            "peer_review_question_collection_translation",
            "peer_review_question_collection_translation.language_id = :language",
            { language },
          )
          .leftJoinAndSelect(
            "peer_review_question.texts",
            "peer_review_question_translation",
            "peer_review_question_translation.language_id = :language",
            { language },
          )
      } else {
        queryBuilder
          .leftJoinAndSelect(
            "peer_review_question_collection.texts",
            "peer_review_question_collection_translation",
          )
          .leftJoinAndSelect(
            "peer_review_question.texts",
            "peer_review_question_translation",
          )
      }
    }

    if (id) {
      queryBuilder.andWhere("quiz.id = :id", { id })
    }

    if (courseId) {
      queryBuilder.andWhere("quiz.courseId = :courseId", { courseId })
    }

    if (exclude) {
      queryBuilder.andWhere("quiz.excluded_from_score = false")
    }

    return await queryBuilder.getMany()
  }

  public async createQuiz(quiz: Quiz): Promise<Quiz | undefined> {
    let oldQuiz: Quiz | undefined
    let newQuiz: Quiz | undefined

    await this.entityManager.transaction(async entityManager => {
      if (quiz!.id) {
        oldQuiz = await entityManager.findOne(Quiz, { id: quiz.id })
        await this.removeOrphans(entityManager, oldQuiz, quiz)
      }

      newQuiz = await entityManager.save(quiz)
    })

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

  private async removeOrphans(
    entityManager: EntityManager,
    oldQuiz: Quiz | undefined,
    newQuiz: Quiz | undefined,
  ): Promise<void> {
    const toBeRemoved: { [key: string]: any[] } = {
      textIds: [],
      itemIds: [],
      optionIds: [],
      prCollectionIds: [],
      prQuestionIds: [],
    }

    if (!oldQuiz) {
      return
    }

    if (oldQuiz.texts) {
      const oldTextIds: Array<{
        quizId: string | undefined
        languageId: string
      }> = oldQuiz.texts.map(text => ({
        quizId: text.quizId,
        languageId: text.languageId,
      }))
      const newTextIds: Array<{
        quizId: string | undefined
        languageId: string
      }> = (newQuiz!.texts || []).map(text => ({
        quizId: text.quizId,
        languageId: text.languageId,
      }))

      const includesId = (
        array: Array<{ quizId: string | undefined; languageId: string }>,
        id: { quizId: string | undefined; languageId: string },
      ) =>
        array.some(
          (arrayId: { quizId: string | undefined; languageId: string }) =>
            arrayId.quizId === id.quizId &&
            arrayId.languageId === id.languageId,
        )

      toBeRemoved.textIds = oldTextIds.filter(id => !includesId(newTextIds, id))
    }

    if (oldQuiz.items) {
      const oldItemIds: string[] = []
      const oldOptionIds: string[] = []
      const newItemIds: string[] = []
      const newOptionIds: string[] = []

      oldQuiz.items.forEach(item => {
        ;(item.options || []).forEach(o => oldOptionIds.push(o.id))
        oldItemIds.push(item.id)
      })

      if (newQuiz) {
        ;(newQuiz!.items || []).forEach(item => {
          ;(item.options || []).forEach(o => newOptionIds.push(o.id))
          newItemIds.push(item.id)
        })
      }

      toBeRemoved.itemIds = oldItemIds.filter(id => !_.includes(newItemIds, id))
      toBeRemoved.optionIds = oldOptionIds.filter(
        id => !_.includes(newOptionIds, id),
      )
    }

    if (oldQuiz.peerReviewQuestionCollections) {
      const oldCollectionIds: string[] = []
      const oldQuestionIds: string[] = []
      const newCollectionIds: string[] = []
      const newQuestionIds: string[] = []

      oldQuiz.peerReviewQuestionCollections.forEach(collection => {
        ;(collection.questions || []).forEach(o => oldQuestionIds.push(o.id))
        oldCollectionIds.push(collection.id)
      })

      if (newQuiz) {
        ;(newQuiz!.peerReviewQuestionCollections || []).forEach(collection => {
          ;(collection.questions || []).forEach(o => newQuestionIds.push(o.id))
          newCollectionIds.push(collection.id)
        })
      }

      toBeRemoved.prCollectionIds = oldCollectionIds.filter(
        id => !_.includes(newCollectionIds, id),
      )
      toBeRemoved.prQuestionIds = oldQuestionIds.filter(
        id => !_.includes(newQuestionIds, id),
      )
    }

    if (toBeRemoved.textIds.length > 0) {
      await entityManager.delete(QuizTranslation, toBeRemoved.textIds)
    }
    if (toBeRemoved.itemIds.length > 0) {
      await entityManager.delete(QuizItem, toBeRemoved.itemIds)
    }
    if (toBeRemoved.optionIds.length > 0) {
      await entityManager.delete(QuizOption, toBeRemoved.optionIds || [])
    }
    if (toBeRemoved.prCollectionIds.length > 0) {
      await entityManager.delete(
        PeerReviewQuestionCollection,
        toBeRemoved.prCollectionIds,
      )
    }
    if (toBeRemoved.prQuestionIds.length > 0) {
      await entityManager.delete(
        PeerReviewQuestion,
        toBeRemoved.prQuestionIds || [],
      )
    }
  }
}

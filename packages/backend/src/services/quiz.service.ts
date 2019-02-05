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
  QueryBuilder,
  ObjectLiteral,
  FindOptionsWhereCondition,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import quizanswerService from "./quizanswer.service"

@Service()
export default class QuizService {
  @InjectManager()
  private entityManager: EntityManager

  public async getQuizzes(query: IQuizQuery): Promise<Quiz[]> {
    const { id, language } = query

    console.log("query", query)
    const queryBuilder: SelectQueryBuilder<
      Quiz
    > = this.entityManager.createQueryBuilder(Quiz, "quiz")

    const whereBuilder: WhereBuilder<Quiz> = new WhereBuilder(queryBuilder)

    queryBuilder.leftJoinAndSelect("quiz.texts", "quiz_translation")
    if (language) {
      whereBuilder.add("quiz_translation.language_id = :language", { language })
    }

    this.queryCourse(queryBuilder, whereBuilder, query)
    this.queryItems(queryBuilder, whereBuilder, query)
    this.queryPeerReviewCollections(queryBuilder, whereBuilder, query)

    if (id) {
      whereBuilder.add("quiz.id = :id", { id })
    }

    return await queryBuilder
      .getMany()
      .then(
        async (quizzes: Quiz[]) =>
          await Promise.all(
            quizzes.map(async (q: Quiz) => this.stripQuiz(q, query)),
          ),
      )
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

  /*   private queryPeerReviews(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { peerreviews, language } = query

    if (!peerreviews) {
      return
    }
    queryBuilder
      .leftJoinAndSelect(
        "quiz.peerReviewQuestionCollections",
        "peer_review_question_collection",
      )
      .leftJoinAndSelect(
        "peer_review_question_collection.texts",
        "peer_review_question_collection_translation",
      )

    if (language) {
      whereBuilder.add(
        // queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where(
            "peer_review_question_collection_translation.language_id = :language",
            {
              language,
            },
          ).orWhere("peer_review_question_collection_translation is null")
        }),
      )
    }
  } */

  /*private queryPeerReviews(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { peerreviews, language } = query

    if (!peerreviews) {
      return
    }
    queryBuilder
      .leftJoinAndSelect("quiz.peerReviewQuestions", "peer_review_question")
      .leftJoinAndSelect(
        "peer_review_question.texts",
        "peer_review_question_translation",
      )

    if (language) {
      whereBuilder.add(
        // queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("peer_review_question_translation.language_id = :language", {
            language,
          }).orWhere("peer_review_question_translation is null")
        }),
      )
    }
  }*/

  private queryOptions(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { options, language } = query

    if (!options) {
      return
    }

    queryBuilder
      .leftJoinAndSelect("quiz_item.options", "quiz_option")
      .leftJoinAndSelect("quiz_option.texts", "quiz_option_translation")

    if (language) {
      whereBuilder.add(
        new Brackets(qb => {
          qb.where("quiz_option_translation.language_id = :language", {
            language,
          }).orWhere("quiz_option_translation.language_id is null")
        }),
      )
    }
  }

  private queryItems(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { items, options, language } = query

    if (!items || !language) {
      return
    }

    queryBuilder
      .leftJoinAndSelect("quiz.items", "quiz_item")
      .leftJoinAndSelect("quiz_item.texts", "quiz_item_translation")

    if (language) {
      whereBuilder.add(
        new Brackets(qb => {
          qb.where("quiz_item_translation.language_id = :language", {
            language,
          }).orWhere("quiz_item_translation.language_id is null")
        }),
      )
    }

    if (options) {
      this.queryOptions(queryBuilder, whereBuilder, query)
    }
  }

  private queryPeerReviewQuestions(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { peerreviews, language } = query

    if (!peerreviews) {
      return
    }

    queryBuilder
      .leftJoinAndSelect("quiz_prqc.questions", "quiz_prq")
      .leftJoinAndSelect("quiz_prq.texts", "quiz_prq_translation")

    if (language) {
      whereBuilder.add(
        new Brackets(qb => {
          qb.where("quiz_prq_translation.language_id = :language", {
            language,
          }).orWhere("quiz_prq_translation.language_id is null")
        }),
      )
    }
  }

  private queryPeerReviewCollections(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { peerreviews, language } = query

    if (!peerreviews || !language) {
      return
    }

    queryBuilder
      .leftJoinAndSelect("quiz.peer_review_question_collections", "quiz_prqc")
      .leftJoinAndSelect("quiz_prqc.texts", "quiz_prqc_translation")

    if (language) {
      whereBuilder.add(
        new Brackets(qb => {
          qb.where("quiz_prqc_translation.language_id = :language", {
            language,
          }).orWhere("quiz_prqc_translation.language_id is null")
        }),
      )
    }

    //if (options) {
    this.queryPeerReviewQuestions(queryBuilder, whereBuilder, query)
    //}
  }

  private queryCourse(
    queryBuilder: SelectQueryBuilder<Quiz>,
    whereBuilder: WhereBuilder<Quiz>,
    query: IQuizQuery,
  ) {
    const { course, courseId, courseAbbreviation, language } = query

    if (!course) {
      return
    }

    queryBuilder
      .innerJoinAndSelect("quiz.course", "course")
      .innerJoinAndSelect("course.texts", "course_translation")
      .innerJoinAndSelect("course.languages", "language")

    if (courseId) {
      whereBuilder.add("course_translation.course_id = :courseId", { courseId })
    }
    if (courseAbbreviation) {
      whereBuilder.add(
        "course_translation.abbreviation = :courseAbbreviation",
        { courseAbbreviation },
      )
    }

    if (language) {
      whereBuilder.add("language.id = :language", { language }).add(
        new Brackets(qb => {
          qb.where("course_translation.language_id = :language", {
            language,
          }).orWhere("course_translation.language_id is null")
        }),
      )
    }
  }

  private async stripQuiz(quiz: Quiz, options: IQuizQuery): Promise<Quiz> {
    await quiz.course

    if (options.language) {
      quiz.texts = quiz.texts.filter(t => t.languageId === options.language)
    }

    if (options.items) {
      if (!options.options) {
        ;(quiz.items || []).forEach(item => {
          item.options = []
        })
      }

      if (options.language) {
        ;(quiz.items || []).forEach(item => {
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

import Knex from "knex"
import _ from "lodash"
import { BadRequestError } from "routing-controllers"
import { Inject, Service } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  PeerReviewCollection,
  PeerReviewQuestion,
  Quiz,
  QuizItem,
  QuizOption,
  QuizTranslation,
} from "../models"
import { IQuizQuery, QuizValidation } from "../types"

import KafkaService from "./kafka.service"
import QuizAnswerService from "./quizanswer.service"
import UserCoursePartStateService from "./usercoursepartstate.service"
import UserQuizStateService from "./userquizstate.service"

@Service()
export default class QuizService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject(type => UserCoursePartStateService)
  private userCoursePartStateService: UserCoursePartStateService

  @Inject(type => KafkaService)
  private kafkaService: KafkaService

  private knex = Knex({ client: "pg" })

  public async getQuizzes(
    query: IQuizQuery,
    manager?: EntityManager,
  ): Promise<Quiz[]> {
    const entityManager = manager || this.entityManager

    const queryBuilder = entityManager.createQueryBuilder(Quiz, "quiz")
    const { courseId, coursePart, exclude, id, language, stripped } = query

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
    if (!stripped) {
      queryBuilder.addSelect("quiz_translation.submitMessage")
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
      queryBuilder.addSelect("item.minWords")
      queryBuilder.addSelect("item.maxWords")
      queryBuilder.addSelect("item.minValue")
      queryBuilder.addSelect("item.maxValue")
      if (language) {
        queryBuilder.leftJoinAndSelect(
          "item.texts",
          "item_translation",
          "item_translation.language_id = :language",
          { language },
        )

        queryBuilder.addSelect("item_translation.minLabel")
        queryBuilder.addSelect("item_translation.maxLabel")
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
        .leftJoinAndSelect("quiz.peerReviewCollections", "prqc")
        .leftJoinAndSelect("prqc.questions", "prq")
      if (language) {
        queryBuilder
          .leftJoinAndSelect(
            "prqc.texts",
            "prqc_translation",
            "prqc_translation.language_id = :language",
            { language },
          )
          .leftJoinAndSelect(
            "prq.texts",
            "prq_translation",
            "prq_translation.language_id = :language",
            { language },
          )
      } else {
        queryBuilder
          .leftJoinAndSelect("prqc.texts", "prqc_translation")
          .leftJoinAndSelect("prq.texts", "prq_translation")
      }
    }

    if (id) {
      queryBuilder.andWhere("quiz.id = :id", { id })
    }

    if (courseId) {
      queryBuilder.andWhere("quiz.courseId = :courseId", { courseId })
    }

    if (coursePart) {
      queryBuilder.andWhere("quiz.part = :part", { part: coursePart })
    }

    if (exclude) {
      queryBuilder.andWhere("quiz.excluded_from_score = false")
    }
    return await queryBuilder.getMany()
  }

  public async saveQuiz(quiz: Quiz): Promise<Quiz | undefined> {
    let oldQuiz: Quiz | undefined
    let savedQuiz: Quiz | undefined

    await this.entityManager.transaction(async manager => {
      if (quiz!.id) {
        oldQuiz = await manager.findOne(Quiz, { id: quiz.id })

        const oldQuizItems = await manager
          .createQueryBuilder(QuizItem, "item")
          .addSelect("item.minWords")
          .addSelect("item.maxWords")
          .addSelect("item.minValue")
          .addSelect("item.maxValue")
          .where("item.quizId = :quizId", { quizId: quiz.id })
          .getMany()

        oldQuiz.items = oldQuizItems

        const validationResult = this.validateModificationOfExistingQuiz(
          quiz,
          oldQuiz,
        )

        if (validationResult.badWordLimit) {
          throw new BadRequestError(
            "New quiz cannot contain stricter limits on essays",
          )
        }

        await this.removeOrphans(manager, oldQuiz, quiz)

        // gotta save the quiz here or user course states update wrong
        savedQuiz = await manager.save(quiz)

        if (validationResult.maxPointsAltered) {
          await this.userQuizStateService.updatePointsForQuiz(
            quiz,
            oldQuiz,
            manager,
          )
        }

        if (
          validationResult.maxPointsAltered ||
          validationResult.coursePartAltered
        ) {
          await this.userCoursePartStateService.updateUserCoursePartStates(
            quiz,
            oldQuiz,
            manager,
          )
          await this.kafkaService.addTask(quiz.courseId, manager)
        }
      } else {
        savedQuiz = await manager.save(quiz)
      }
    })

    return savedQuiz
  }

  public async updateQuiz(quiz: Quiz): Promise<Quiz> {
    let result
    try {
      result = await this.entityManager.save(quiz)
    } catch (error) {
      throw new Error(error.message)
    }
    return result
  }

  public async deleteQuiz(id: string): Promise<boolean> {
    try {
      await this.entityManager.delete(Quiz, { id })

      return true
    } catch {
      return false
    }
  }

  public async getPlainQuizData(quizId: string) {
    const builder = Knex({ client: "pg" })

    let query = builder("quiz")
      .select()
      .where("quiz.id", quizId)
      .join("quiz_translation", "quiz_translation.quiz_id", "quiz.id")
      .select("id", "title", "body", "submit_message")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data = await queryRunner.stream(query.toString())
    await queryRunner.release()

    return data
  }

  public async getPlainQuizItems(quizId: string) {
    const builder = Knex({ client: "pg" })

    let query = builder("quiz_item")
      .where("quiz_item.quiz_id", quizId)
      .select(
        "quiz_item.id",
        "type",
        "order",
        "validity_regex",
        "format_regex",
        "multi",
        "min_words",
        "max_words",
        "min_value",
        "max_value",
      )
      .innerJoin(
        "quiz_item_translation",
        "quiz_item_translation.quiz_item_id",
        "quiz_item.id",
      )
      .select("title", "body", "success_message", "failure_message")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data = await queryRunner.stream(query.toString())
    await queryRunner.release()
    return data
  }

  public async getPlainQuizItemOptions(quizId: string) {
    const builder = Knex({ client: "pg" })

    let query = builder("quiz_item")
      .where("quiz_item.quiz_id", quizId)
      .innerJoin("quiz_option", "quiz_option.quiz_item_id", "quiz_item.id")
      .select(
        "quiz_option.quiz_item_id",
        "quiz_option.id",
        "quiz_option.correct",
      )
      .innerJoin(
        "quiz_option_translation",
        "quiz_option_translation.quiz_option_id",
        "quiz_option.id",
      )
      .select("title", "body", "success_message", "failure_message")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data = await queryRunner.stream(query.toString())
    await queryRunner.release()

    return data
  }

  public async getPlainQuizPeerReviewCollections(quizId: string) {
    const builder = Knex({ client: "pg" })
    let query = builder("peer_review_collection")
      .where("peer_review_collection.quiz_id", quizId)
      .select("id")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data = await queryRunner.stream(query.toString())
    await queryRunner.release()

    return data
  }

  public async getPlainQuizPeerReviewQuestions(quizId: string) {
    const builder = Knex({ client: "pg" })

    let query = builder("peer_review_question")
      .where("peer_review_question.quiz_id", quizId)
      .select(
        "peer_review_question.id",
        "peer_review_question.peer_review_collection_id",
        "peer_review_question.default",
        "type",
        "answer_required",
      )
      .innerJoin(
        "peer_review_question_translation",
        "peer_review_question_translation.peer_review_question_id",
        "peer_review_question.id",
      )
      .select("language_id", "title", "body")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data = await queryRunner.stream(query.toString())
    await queryRunner.release()

    return data
  }

  public async getCSVData(quizId: string) {
    const builder = Knex({ client: "pg" })

    const quiz = (
      await this.getQuizzes({
        id: quizId,
        peerreviews: true,
        options: true,
        items: true,
      })
    )[0]

    if (!quiz) {
      return
    }

    let query = builder("quiz")
      .where("quiz.id", quizId)
      .innerJoin("quiz_translation", "quiz_translation.quiz_id", "quiz.id")
      .select(
        "quiz.course_id",
        "quiz.id",
        { quiz_title: "quiz_translation.title" },
        "quiz.part",
        "quiz.section",
        "quiz.points",
        "quiz.deadline",
        "quiz.open",
        "quiz.excluded_from_score",
        "quiz.auto_confirm",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    let data: any[] = await queryRunner.query(query.toString())
    await queryRunner.release()

    let info = data[0]

    const newInfo = { ...info }

    quiz.items.forEach((item, idx) => {
      newInfo[`item_${idx}_id`] = item.id
      newInfo[`item_${idx}_type`] = item.type
      if (item.type === "open") {
        newInfo[`item_${idx}_validity_regex`] = item.validityRegex
        newInfo[`item_${idx}_format_regex`] = item.formatRegex
      } else if (item.type === "scale") {
        newInfo[`item_${idx}_min_value`] = item.minValue
        newInfo[`item_${idx}_max_value`] = item.maxValue
      } else if (item.type === "essay") {
        newInfo[`item_${idx}_min_words`] = item.minWords
        newInfo[`item_${idx}_max_words`] = item.maxWords
      }
      newInfo[`item_${idx}_title`] = item.texts[0].title
      newInfo[`item_${idx}_body`] = item.texts[0].body

      if (
        item.type === "multiple-choice" ||
        item.type === "checkbox" ||
        item.type === "research-agreement"
      ) {
        item.options.forEach((opt, i) => {
          newInfo[`item_${idx}_opt_${i}_id`] = opt.id
          newInfo[`item_${idx}_opt_${i}_correct`] = opt.correct
          newInfo[`item_${idx}_opt_${i}_title`] = opt.texts[0].title
          newInfo[`item_${idx}_opt_${i}_body`] = opt.texts[0].body
        })
      }
    })

    data[0] = { ...data[0], ...newInfo }

    if (quiz.peerReviewCollections.length > 0) {
      data = data.map(d => {
        const newD = { ...d }
        for (let i = 0; i < quiz.peerReviewCollections.length; i++) {
          newD[`peer_review_collection_${i}_id`] =
            quiz.peerReviewCollections[i].id
          const peerReviewQuestions = quiz.peerReviewCollections[i].questions

          peerReviewQuestions.forEach((question, idx) => {
            newD[`prc_${i}_question_${idx}_id`] = question.id
            newD[`prc_${i}_question_${idx}_default`] = question.default
            newD[`prc_${i}_question_${idx}_type`] = question.type
            newD[`prc_${i}_question_${idx}_answer_required`] =
              question.answerRequired
            newD[`prc_${i}_question_${idx}_title`] = question.texts[0].title
            newD[`prc_${i}_question_${idx}_body`] = question.texts[0].body
          })
        }
        return newD
      })
    }

    return data
  }

  public async getCourseParts(
    courseId: string,
    manager?: EntityManager,
  ): Promise<number[]> {
    const entityManager = manager || this.entityManager

    const query = this.knex
      .distinct("part")
      .from("quiz")
      .where("course_id", courseId)
      .orderBy("part")

    return (await entityManager.query(query.toString())).map(
      (q: { [part: string]: number }) => q.part,
    )
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

    if (oldQuiz.peerReviewCollections) {
      const oldCollectionIds: string[] = []
      const oldQuestionIds: string[] = []
      const newCollectionIds: string[] = []
      const newQuestionIds: string[] = []

      oldQuiz.peerReviewCollections.forEach(collection => {
        ;(collection.questions || []).forEach(o => oldQuestionIds.push(o.id))
        oldCollectionIds.push(collection.id)
      })

      if (newQuiz) {
        ;(newQuiz!.peerReviewCollections || []).forEach(collection => {
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
        PeerReviewCollection,
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

  private validateModificationOfExistingQuiz(
    quiz: Quiz,
    oldQuiz: Quiz,
  ): QuizValidation {
    const badWordLimit = oldQuiz.items.some(qi => {
      if (qi.type !== "essay") {
        return false
      }
      const qi2 = quiz.items.find(x => x.id === qi.id)

      if (!qi2) {
        return false
      }
      if (qi2.minWords && (!qi.minWords || qi.minWords < qi2.minWords)) {
        return true
      }
      if (qi2.maxWords && (!qi.maxWords || qi.maxWords > qi2.maxWords)) {
        return true
      }
      return false
    })

    const maxPointsAltered = quiz.points !== oldQuiz.points

    const coursePartAltered = quiz.part !== oldQuiz.part

    return {
      badWordLimit,
      maxPointsAltered,
      coursePartAltered,
    }
  }
}

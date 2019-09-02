import knex from "knex"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import validator from "validator"
import {
  PeerReview,
  PeerReviewCollection,
  Quiz,
  QuizAnswer,
  QuizItem,
  SpamFlag,
  UserQuizState,
} from "../models"
import { IQuizAnswerQuery } from "../types"
import { WhereBuilder } from "../util/index"
import QuizService from "./quiz.service"

@Service()
export default class QuizAnswerService {
  @InjectManager()
  private entityManager: EntityManager

  public async createQuizAnswer(
    manager: EntityManager,
    quizAnswer: QuizAnswer,
  ) {
    if (!quizAnswer) {
      return
    }

    return manager.save(quizAnswer)
  }

  public async getAnswer(
    query: IQuizAnswerQuery,
    manager: EntityManager,
  ): Promise<QuizAnswer> {
    const { id, userId, quizId, statuses } = query
    const queryBuilder = manager.createQueryBuilder(QuizAnswer, "quiz_answer")
    const whereBuilder: WhereBuilder<QuizAnswer> = new WhereBuilder(
      queryBuilder,
    )

    if (id) {
      whereBuilder.add("quiz_answer.id = :id", { id })
    }

    if (userId) {
      whereBuilder.add("quiz_answer.user_id = :userId", { userId })
    }

    if (quizId) {
      whereBuilder.add("quiz_answer.quiz_id = :quizId", { quizId })
    }

    if (statuses && statuses.length > 0) {
      whereBuilder.add("quiz_answer.status in (:...statuses)", { statuses })
    }

    return await queryBuilder.orderBy("quiz_answer.created_at", "DESC").getOne()
  }

  public async getAnswers(query: IQuizAnswerQuery): Promise<QuizAnswer[]> {
    let { skip, limit } = query
    skip = typeof skip === "number" ? skip : 0
    limit = typeof limit === "number" ? limit : 0
    if (skip < 0) {
      skip = 0
    }
    if (limit < 0) {
      limit = 0
    }

    if (limit > 100) {
      limit = 100
    }

    if (query.quizRequiresPeerReviews && query.quizId) {
      const prc = await PeerReviewCollection.createQueryBuilder("prc")
        .where("prc.quiz_id = :quizId", { quizId: query.quizId })
        .getCount()

      if (prc < 1) {
        return []
      }
    }

    const result = (await this.constructGetAnswersQuery(query))
      .skip(skip)
      .take(limit)
      .getMany()

    return result
  }

  public async getAnswersCount(query: IQuizAnswerQuery): Promise<any> {
    const someQuery = await this.constructGetAnswersQuery(query)

    if (query.quizRequiresPeerReviews && query.quizId) {
      const prc = await PeerReviewCollection.createQueryBuilder("prc")
        .where("prc.quiz_id = :quizId", { quizId: query.quizId })
        .getCount()

      if (prc) {
        return { quizId: query.quizId, count: 0 }
      }
    }

    const result = await someQuery
      .select("quiz_answer.quiz_id", "quizId")
      .addSelect("COUNT(quiz_answer.id)")
      .groupBy("quiz_answer.quiz_id")
      .getRawMany()

    if (!query.quizId) {
      return result
    }

    return result.length > 0 ? result[0] : {}
  }

  public async getPlainAnswers(quizId: string): Promise<any> {
    if (!validator.isUUID(quizId)) {
      return {}
    }

    const builder = knex({ client: "pg" })

    const query = builder("quiz_answer")
      .select(
        { answer_id: "quiz_answer.id" },
        "quiz_answer.user_id",
        "quiz_answer.status",
        "quiz_answer.created_at",
        "quiz_answer.updated_at",
      )
      .where("quiz_answer.quiz_id", quizId)
      .leftJoin(
        "user_quiz_state",
        "user_quiz_state.user_id",
        "quiz_answer.user_id",
      )
      .select(
        "user_quiz_state.peer_reviews_given",
        "user_quiz_state.peer_reviews_received",
        "user_quiz_state.points_awarded",
        "user_quiz_state.spam_flags",
        "user_quiz_state.tries",
        { quiz_state_status: "user_quiz_state.status" },
        "user_quiz_state.created_at",
        "user_quiz_state.updated_at",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    const data = await queryRunner.stream(query.toString())

    await queryRunner.release()
    return data
  }

  public async getPlainItemAnswers(quizId: string): Promise<any> {
    const builder = knex({ client: "pg" })

    const query = builder("quiz_item")
      .where("quiz_item.quiz_id", quizId)
      .innerJoin(
        "quiz_item_answer",
        "quiz_item_answer.quiz_item_id",
        "quiz_item.id",
      )
      .select(
        { quiz_answer_id: "quiz_item_answer.quiz_answer_id" },
        { quiz_item_id: "quiz_item_answer.quiz_item_id" },
        { item_answer_id: "quiz_item_answer.id" },
        "quiz_item_answer.text_data",
        "quiz_item_answer.int_data",
        "quiz_item_answer.correct",
        "quiz_item_answer.created_at",
        "quiz_item_answer.updated_at",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()
    const data = await queryRunner.stream(query.toString())

    await queryRunner.release()
    return data
  }

  public async getPlainOptionAnswers(quizId: string): Promise<any> {
    const builder = knex({ client: "pg" })

    const query = builder("quiz_item")
      .where("quiz_item.quiz_id", quizId)
      .innerJoin("quiz_option", "quiz_option.quiz_item_id", "quiz_item.id")
      .innerJoin(
        "quiz_option_answer",
        "quiz_option_answer.quiz_option_id",
        "quiz_option.id",
      )

      .select(
        { quiz_item_answer_id: "quiz_option_answer.quiz_item_answer_id" },
        { option_answer_id: "quiz_option_answer.id" },
        { option_id: "quiz_option_answer.quiz_option_id" },
        "quiz_option_answer.created_at",
        "quiz_option_answer.updated_at",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()
    const data = await queryRunner.stream(query.toString())

    await queryRunner.release()
    return data
  }

  public async getCSVData(quizId: string): Promise<any> {
    if (!validator.isUUID(quizId)) {
      return {}
    }

    const quizItemTypes = (await QuizItem.createQueryBuilder("quiz_item")
      .select("quiz_item.type")
      .where("quiz_id = :id", { id: quizId })
      .getRawMany()).map(value => value.quiz_item_type)

    const builder = knex({ client: "pg" })

    let query = builder("quiz_answer")
      .select({ answer_id: "quiz_answer.id" }, "quiz_answer.user_id", "status")
      .where("quiz_answer.quiz_id", quizId)
      .leftJoin(
        "quiz_item_answer",
        "quiz_item_answer.quiz_answer_id",
        "quiz_answer.id",
      )
      .innerJoin("quiz_item", "quiz_item.id", "quiz_item_answer.quiz_item_id")
      .select({ quiz_item_id: "quiz_item.id" }, "quiz_item.type")

    let selectedFields: string[] = []

    if (
      quizItemTypes.some(
        type =>
          type === "multiple-choice" ||
          type === "checkbox" ||
          type === "research-agreement",
      )
    ) {
      query = query
        .leftJoin(
          "quiz_option_answer",
          "quiz_option_answer.quiz_item_answer_id",
          "quiz_item_answer.id",
        )

        .innerJoin(
          "quiz_option",
          "quiz_option.id",
          "quiz_option_answer.quiz_option_id",
        )

        .innerJoin(
          "quiz_option_translation",
          "quiz_option_translation.quiz_option_id",
          "quiz_option.id",
        )

        .select(
          "quiz_option_answer.quiz_option_id",
          "quiz_option_translation.language_id",
          "quiz_option_translation.title",
          "quiz_option_translation.body",
        )

      selectedFields.push("correct")
    } else if (
      quizItemTypes.length === 1 ||
      quizItemTypes.every(type => type === quizItemTypes[0])
    ) {
      switch (quizItemTypes[0]) {
        case "open":
          selectedFields.push("correct")
        case "essay":
          selectedFields.push("text_data")
          break
        case "scale":
          selectedFields.push("int_data")
          break
        default:
          selectedFields = ["text_data", "int_data", "correct"]
      }
    } else {
      selectedFields = ["text_data", "int_data", "correct"]
    }

    query = query.select(
      ...selectedFields.map(field => `quiz_item_answer.${field}`),
    )

    query = query.select("quiz_answer.created_at", "quiz_answer.updated_at")

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    const data = await queryRunner.stream(query.toString())

    await queryRunner.release()

    return data
  }

  public async getAnswersSpamCounts(quizId: string): Promise<any> {
    const spamFlagCount = await QuizAnswer.createQueryBuilder("quiz_answer")
      .select("quiz_answer.id")
      .addSelect("COUNT(spam_flag.user_id)")
      .leftJoin(
        SpamFlag,
        "spam_flag",
        "quiz_answer.id = spam_flag.quiz_answer_id",
      )
      .where("quiz_answer.quiz_id = :quiz_id", { quiz_id: quizId })
      .groupBy("quiz_answer.id")
      .getRawMany()
    return spamFlagCount
  }

  private async constructGetAnswersQuery(
    query: IQuizAnswerQuery,
  ): Promise<SelectQueryBuilder<QuizAnswer>> {
    const {
      id,
      quizId,
      userId,
      statuses,
      firstAllowedTime,
      lastAllowedTime,
      languageIds,
      peerReviewsGiven,
      peerReviewsReceived,
      quizRequiresPeerReviews,
      spamFlags,
      addPeerReviews,
      addSpamFlagNumber,
    } = query

    const queryBuilder: SelectQueryBuilder<
      QuizAnswer
    > = QuizAnswer.createQueryBuilder("quiz_answer")

    // allows for fast lookup of some statistics, but unsure if quiz state matches the real state in all cases
    // methods managing without still left behind else branches
    const allowedToUseUQS = true

    if (
      !id &&
      !quizId &&
      (!statuses || statuses.length === 0) &&
      !firstAllowedTime &&
      !lastAllowedTime &&
      (!languageIds || languageIds.length === 0) &&
      typeof peerReviewsGiven !== "number" &&
      typeof peerReviewsReceived !== "number" &&
      typeof spamFlags !== "number"
    ) {
      return null
    }

    if (addPeerReviews) {
      queryBuilder
        .leftJoinAndMapMany(
          "quiz_answer.peerReviews",
          PeerReview,
          "peer_review",
          "peer_review.quiz_answer_id = quiz_answer.id",
        )
        .leftJoinAndSelect("peer_review.answers", "peer_review_question_answer")
    }

    // so we can addWhere without regard for the first occurrence of 'where'
    queryBuilder.where("1 = 1")

    if (id) {
      queryBuilder.andWhere("quiz_answer.id = :id", { id })
    }

    if (quizId) {
      queryBuilder.andWhere("quiz_answer.quiz_id = :quiz_id", {
        quiz_id: quizId,
      })
    } else if (quizRequiresPeerReviews) {
      queryBuilder
        .innerJoin(Quiz, "quiz", "quiz_answer.quiz_id = quiz.id")
        .innerJoin(PeerReviewCollection, "prc", "prc.quiz_id = quiz.id")
        .where("prc.quiz_id IS NOT NULL")
    }

    if (userId) {
      queryBuilder.andWhere("quiz_answer.user_id = :user_id", {
        user_id: userId,
      })
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere("quiz_answer.status IN (:...statuses)", {
        statuses,
      })
    }

    if (firstAllowedTime) {
      queryBuilder.andWhere("quiz_answer.created_at >= :first_date", {
        first_date: firstAllowedTime,
      })
    }

    if (lastAllowedTime) {
      queryBuilder.andWhere("quiz_answer.created_at <= :last_date", {
        last_date: lastAllowedTime,
      })
    }

    if (languageIds && languageIds.length > 0) {
      queryBuilder.andWhere("quiz_answer.language_id IN (:...language_ids)", {
        language_ids: languageIds,
      })
    }

    let userIdsInSuitableUQStates = null

    if (
      typeof peerReviewsGiven === "number" &&
      (peerReviewsGiven > 0 && peerReviewsGiven < 1000) &&
      quizId
    ) {
      if (allowedToUseUQS) {
        userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
          .andWhere("user_quiz_state.peer_reviews_given >= :peerReviewsGiven", {
            peerReviewsGiven,
          })
      } else {
        const prcIdsQuery = await PeerReviewCollection.createQueryBuilder(
          "peer_review_collection",
        )
          .select("peer_review_collection.id")
          .where("peer_review_collection.quiz_id = :quiz_id", {
            quiz_id: quizId,
          })

        const userIdsAndCountsQuery = await PeerReview.createQueryBuilder(
          "peer_review",
        )
          .select("peer_review.user_id", "user_id")
          .addSelect("COUNT(*)", "count")
          .where(
            "peer_review.peer_review_collection_id IN (" +
              prcIdsQuery.getQuery() +
              ")",
          )
          .setParameters(prcIdsQuery.getParameters())
          .groupBy("peer_review.user_id")
          .having("peer_review.count >= " + peerReviewsGiven)

        const acceptableUserIdsQuery =
          "SELECT user_id AS user_id FROM (" +
          userIdsAndCountsQuery.getQuery() +
          ") AS foo"

        queryBuilder
          .andWhere("quiz_answer.user_id IN (" + acceptableUserIdsQuery + ")")
          .setParameters(userIdsAndCountsQuery.getParameters())
      }
    }

    if (
      typeof peerReviewsReceived === "number" &&
      peerReviewsReceived > 0 &&
      peerReviewsReceived <= 1000 &&
      quizId
    ) {
      if (allowedToUseUQS) {
        if (userIdsInSuitableUQStates) {
          userIdsInSuitableUQStates.andWhere(
            "user_quiz_state.peer_reviews_received >= :peerReviewsReceived",
            { peerReviewsReceived },
          )
        } else {
          userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
            "user_quiz_state",
          )
            .select("user_quiz_state.user_id")
            .where("user_quiz_state.quiz_id = :quizId", { quizId })
            .andWhere(
              "user_quiz_state.peer_reviews_received >= :peerReviewsReceived",
              { peerReviewsReceived },
            )
        }
      } else {
        const prcIdsQuery = await PeerReviewCollection.createQueryBuilder(
          "peer_review_collection",
        )
          .select("peer_review_collection.id")
          .where("peer_review_collection.quiz_id = :quiz_id", {
            quiz_id: quizId,
          })

        const receivedQuery = PeerReview.createQueryBuilder("peer_review")
          .select("peer_review.quiz_answer_id")
          .addSelect("COUNT(*)", "count")
          .where(
            "peer_review.peer_review_collection_id IN (" +
              prcIdsQuery.getQuery() +
              ")",
          )
          .groupBy("peer_review.quiz_answer_id")
          .having("peer_review.count >= " + peerReviewsReceived)

        const goodQuery =
          "SELECT quiz_answer_id AS quiz_answer_id FROM (" +
          receivedQuery.getQuery() +
          ") AS foo2"

        queryBuilder
          .andWhere("quiz_answer.id IN (" + goodQuery + ")")
          .setParameters(receivedQuery.getParameters())
      }
    }

    if (typeof spamFlags === "number" && spamFlags > 0 && spamFlags <= 10000) {
      if (allowedToUseUQS) {
        if (userIdsInSuitableUQStates) {
          userIdsInSuitableUQStates.andWhere(
            "user_quiz_state.spam_flags >= :spamFlags",
            { spamFlags },
          )
        } else {
          userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
            "user_quiz_state",
          )
            .select("user_quiz_state.user_id")
            .where("user_quiz_state.quiz_id = :quizId", { quizId })
            .andWhere("user_quiz_state.spam_flags >= :spamFlags", { spamFlags })
        }
      } else {
        const spamQuery = await SpamFlag.createQueryBuilder("spam_flag")
          .select("spam_flag.quiz_answer_id")
          .addSelect("COUNT(*)", "count")
          .groupBy("spam_flag.quiz_answer_id")
          .having("count >= " + spamFlags)

        const acceptableIdsQuery =
          "SELECT quiz_answer_id AS quiz_answer_id FROM (" +
          spamQuery.getQuery() +
          ") AS foo3"

        queryBuilder.andWhere("quiz_answer.id IN (" + acceptableIdsQuery + ")")
      }
    }

    if (userIdsInSuitableUQStates) {
      queryBuilder
        .andWhere(
          "quiz_answer.user_id IN (" +
            userIdsInSuitableUQStates.getQuery() +
            ")",
        )
        .setParameters(userIdsInSuitableUQStates.getParameters())
    }

    if (addSpamFlagNumber) {
      queryBuilder.leftJoinAndMapOne(
        "quiz_answer.userQuizState",
        UserQuizState,
        "user_quiz_state",
        "user_quiz_state.quiz_id = quiz_answer.quiz_id " +
          "AND user_quiz_state.user_id = quiz_answer.user_id",
      )
    }

    return queryBuilder
  }
}

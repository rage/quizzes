import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder, getConnection } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  PeerReview,
  QuizAnswer,
  UserQuizState,
  SpamFlag,
  PeerReviewCollection,
} from "../models"
import { IQuizAnswerQuery } from "../types"
import { WhereBuilder } from "../util/index"
import QuizService from "./quiz.service"

@Service()
export default class QuizAnswerService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizService: QuizService

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
    const { id, userId, quizId, status } = query
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

    if (status) {
      whereBuilder.add("quiz_answer.status = :status", { status })
    }

    return await queryBuilder.orderBy("quiz_answer.updated_at", "DESC").getOne()
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
      spamFlags,
      addPeerReviews,
      addSpamFlagNumber,
    } = query

    const queryBuilder: SelectQueryBuilder<
      QuizAnswer
    > = QuizAnswer.createQueryBuilder("quiz_answer")

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

    if (addSpamFlagNumber) {
      if (false) {
        // allowedToUseUQS ) { - for test data this suits better in every case
        queryBuilder.leftJoinAndMapOne(
          "quiz_answer.userQuizState",
          UserQuizState,
          "user_quiz_state",
          "user_quiz_state.quiz_id = quiz_answer.quiz_id " +
            "AND user_quiz_state.user_id = quiz_answer.user_id",
        )
      } else {
        queryBuilder.leftJoinAndMapMany(
          "quiz_answer.spamFlags",
          SpamFlag,
          "spam_flag",
          "spam_flag.quiz_answer_id = quiz_answer.id",
        )
      }
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
    }

    if (userId) {
      queryBuilder.andWhere("quiz_answer.user_id = :user_id", {
        user_id: userId,
      })
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere("quiz_answer.status IN (:...statuses)", {
        statuses: statuses,
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

    // to make sense, the peer reviews for a certain quiz
    if (
      typeof peerReviewsGiven === "number" &&
      (peerReviewsGiven > 0 && peerReviewsGiven < 1000) &&
      quizId
    ) {
      // 1. Jos UserQuizState ajan tasalla
      if (allowedToUseUQS) {
        const userIdsQuery = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
          .andWhere("user_quiz_state.peer_reviews_given >= :peerReviewsGiven", {
            peerReviewsGiven,
          })

        queryBuilder
          .andWhere("quiz_answer.user_id IN (" + userIdsQuery.getQuery() + ")")
          .setParameters(userIdsQuery.getParameters())
      } else {
        // 2. Jos UserQuizState ei ajan tasalla
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

    // peer reviews for certain quiz: received total of all peer reviews is of no interest!
    if (
      typeof peerReviewsReceived === "number" &&
      // kriteerinä 0 -> kaikki täyttävät -> ei tarvetta rajata enempää
      peerReviewsReceived > 0 &&
      peerReviewsReceived <= 1000 &&
      quizId
    ) {
      // 1. Jos UserQuizState ajan tasalla

      if (allowedToUseUQS) {
        const userIdsQuery = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
          .andWhere(
            "user_quiz_state.peer_reviews_received >= :peerReviewsReceived",
            { peerReviewsReceived },
          )

        queryBuilder
          .andWhere("quiz_answer.user_id IN (" + userIdsQuery.getQuery() + ")")
          .setParameters(userIdsQuery.getParameters())
      } else {
        // 2. Jos UQS ei ajan tasalla

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
      // 1. Jos UserQuizState ajan tasalla
      if (allowedToUseUQS) {
        const userIdsQuery = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
          .andWhere("user_quiz_state.spam_flags >= :spamFlags", { spamFlags })

        queryBuilder
          .andWhere("quiz_answer.user_id IN (" + userIdsQuery.getQuery() + ")")
          .setParameters(userIdsQuery.getParameters())
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

    return queryBuilder
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

    return (await this.constructGetAnswersQuery(query))
      .skip(skip)
      .take(limit)
      .getMany()
  }

  public async getAnswersCount(query: IQuizAnswerQuery): Promise<any> {
    const someQuery = await this.constructGetAnswersQuery(query)

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
}

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
    } = query

    const queryBuilder: SelectQueryBuilder<
      QuizAnswer
    > = QuizAnswer.createQueryBuilder("quiz_answer")

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
      (peerReviewsGiven >= 0 && peerReviewsGiven < 1000) &&
      quizId
    ) {
      // is table peer_review_collection up-to-date?
      const prcIsInGoodShape = true

      let goodQuery: string

      if (prcIsInGoodShape) {
        const prcIdsQuery = await PeerReviewCollection.createQueryBuilder(
          "peer_review_collection",
        )
          .select("peer_review_collection.id")
          .where("peer_review_collection.quiz_id = :quiz_id", {
            quiz_id: quizId,
          })

        const givenQuery = await PeerReview.createQueryBuilder("peer_review")
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
        goodQuery =
          "SELECT user_id AS user_id FROM (" +
          givenQuery.getQuery() +
          ") AS foo"
      } else {
      }

      queryBuilder.andWhere("quiz_answer.user_id IN (" + goodQuery + ")")
    }

    // peer reviews for certain quiz: received total of all peer reviews is of no interest!
    if (
      typeof peerReviewsReceived === "number" &&
      peerReviewsReceived >= 0 &&
      peerReviewsReceived <= 1000 &&
      !quizId
    ) {
      //certain to work but slower

      const prcIdsQuery = await PeerReviewCollection.createQueryBuilder(
        "peer_review_collection",
      )
        .select("peer_review_collection.id")
        .where("peer_review_collection.quiz_id = :quiz_id", { quiz_id: quizId })

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

      //words if user_quiz_state up to date
      // to do

      queryBuilder
        .andWhere("quiz_answer.id IN (" + goodQuery + ")")
        .setParameters(receivedQuery.getParameters())
    }

    if (typeof spamFlags === "number" && spamFlags >= 0 && spamFlags <= 10000) {
      // etsitään kaikki sopivat
      const spamQuery = await SpamFlag.createQueryBuilder("spam_flag")
        .select("spam_flag.quiz_answer_id")
        .addSelect("COUNT(*)", "count")
        .groupBy("spam_flag.quiz_answer_id")
        .having("count >= " + spamFlags)

      const goodQuery =
        "SELECT quiz_answer_id AS quiz_answer_id FROM (" +
        spamQuery.getQuery() +
        ") AS foo3"

      queryBuilder.andWhere("quiz_answer.id IN (" + goodQuery + ")")
    }

    console.log("Logging the sql")
    queryBuilder.printSql()

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

  public async getAttentionAnswersCount(): Promise<any[]> {
    return await QuizAnswer.createQueryBuilder("quiz_answer")
      .select("quiz_answer.quiz_id", "quizId")
      .addSelect("COUNT(quiz_answer.id)")
      .where("quiz_answer.status IN ('spam', 'submitted')")
      .groupBy("quiz_answer.quiz_id")
      .getRawMany()
  }

  public async getAnswersCount(query: IQuizAnswerQuery): Promise<any> {
    const someQuery = await this.constructGetAnswersQuery(query)

    return await someQuery
      .select("quiz_answer.quiz_id")
      .addSelect("COUNT(*)")
      .groupBy("quiz_answer.quiz_id")
      .getRawMany()
  }

  public async getNumberOfAnswers(quizId: string): Promise<any> {
    const result = await QuizAnswer.createQueryBuilder("quiz_answer")
      .select("quiz_answer.quiz_id", "quizId")
      .addSelect("COUNT(quiz_answer.id)")
      .where("quiz_answer.quiz_id = :quiz_id", { quiz_id: quizId })
      .groupBy("quiz_answer.quiz_id")
      .getRawMany()

    if (result.length === 0) {
      return {}
    }

    return result[0]
  }

  public async getAnswersStatistics(quizId: string): Promise<any> {
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

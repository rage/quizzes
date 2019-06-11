import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { PeerReview, QuizAnswer, UserQuizState, SpamFlag } from "../models"
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

  public async getAnswers(query: IQuizAnswerQuery): Promise<QuizAnswer[]> {
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
      return []
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
      queryBuilder.andWhere("quiz_answer.created_at > :first_date", {
        first_date: firstAllowedTime,
      })
    }

    if (lastAllowedTime) {
      queryBuilder.andWhere("quiz_answer_created_at < :last_date", {
        last_date: lastAllowedTime,
      })
    }

    if (languageIds && languageIds.length > 0) {
      queryBuilder.andWhere("quiz_answer.language_id IN (:...language_ids)", {
        language_ids: languageIds,
      })
    }

    if (typeof peerReviewsGiven === "number" && userId) {
      //certain to work but slower
      const givenQuery = await PeerReview.createQueryBuilder("peer_review")
        .select("peer_review.user_id")
        .addSelect("COUNT(*)")
        .groupBy("peer_review.user_id")
        .having("count >= :given_count", { given_count: peerReviewsGiven })

      //words if user_quiz_state up to date
      //to do

      queryBuilder
        .andWhere("quiz_answer.user_id IN (" + givenQuery.getQuery() + ")")
        .setParameters(givenQuery.getParameters())
    }

    if (typeof peerReviewsReceived === "number") {
      //certain to work but slower
      const receivedQuery = PeerReview.createQueryBuilder("peer_review")
        .select("peer_review.quiz_answer_id")
        .addSelect("COUNT(*)")
        .groupBy("peer_review.quiz_answer_id")
        .having("count >= :received_count", {
          received_count: peerReviewsReceived,
        })

      //words if user_quiz_state up to date
      // to do

      queryBuilder
        .andWhere("quiz_answer.id IN (" + receivedQuery.getQuery() + ")")
        .setParameters(receivedQuery.getParameters())
    }

    if (typeof spamFlags === "number") {
      // etsitään kaikki sopivat
      const spamQuery = await SpamFlag.createQueryBuilder("spam_flag")
        .select("spam_flag.quiz_answer_id")
        .addSelect("COUNT(*)")
        .groupBy("spam_flag.quiz_answer_id")
        .having("count >= :num_of_flags", { num_of_flags: spamFlags })

      queryBuilder
        .andWhere("quiz_answer.id IN (" + spamQuery.getQuery() + ")")
        .setParameters(spamQuery.getParameters)
    }

    console.log("Logging the sql")
    queryBuilder.printSql()

    return await queryBuilder.getMany()
  }

  public async getEveryonesAnswers(
    quizId: string,
    skip = 0,
    limit = 50,
    addPeerReviews?: boolean,
  ): Promise<QuizAnswer[]> {
    let query = QuizAnswer.createQueryBuilder("quiz_answer")

    if (addPeerReviews) {
      query = query
        .leftJoinAndMapMany(
          "quiz_answer.peerReviews",
          PeerReview,
          "peer_review",
          "peer_review.quiz_answer_id = quiz_answer.id",
        )
        .leftJoinAndSelect("peer_review.answers", "peer_review_question_answer")
    }

    query = query
      .where("quiz_answer.quiz_id = :quiz_id", { quiz_id: quizId })
      .skip(skip)
      .take(limit)

    return await query.getMany()
  }

  public async getAttentionAnswers(
    quizId: string,
    skip = 0,
    limit = 50,
    addPeerReviews?: boolean,
  ): Promise<QuizAnswer[]> {
    let query = QuizAnswer.createQueryBuilder("quiz_answer")

    if (addPeerReviews) {
      query = query
        .leftJoinAndMapMany(
          "quiz_answer.peerReviews",
          PeerReview,
          "peer_review",
          "peer_review.quiz_answer_id = quiz_answer.id",
        )
        .leftJoinAndSelect("peer_review.answers", "peer_review_question_answer")
    }

    query = query
      .where("quiz_answer.quiz_id = :quiz_id", { quiz_id: quizId })
      .andWhere("quiz_answer.status IN ('spam', 'submitted')")
      .skip(skip)
      .take(limit)

    return await query.getMany()
  }

  public async getAttentionAnswersCount(): Promise<any[]> {
    return await QuizAnswer.createQueryBuilder("quiz_answer")
      .select("quiz_answer.quiz_id", "quizId")
      .addSelect("COUNT(quiz_answer.id)")
      .where("quiz_answer.status IN ('spam', 'submitted')")
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

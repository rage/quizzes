import Knex from "knex"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder, EntityRepository } from "typeorm"
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
import { AnsweredQuiz, IQuizAnswerQuery } from "../types"
import { WhereBuilder, stringContainsLongerWord } from "../util/index"

// tslint:disable-next-line:max-line-length
// import PlainObjectToDatabaseEntityTransformer from "../../../../node_modules/typeorm/query-builder/transformer/PlainObjectToDatabaseEntityTransformer"

// tslint:disable-next-line:max-line-length
import { PlainObjectToDatabaseEntityTransformer } from "typeorm/query-builder/transformer/PlainObjectToDatabaseEntityTransformer"
import { setCorrectValuesForAwardPointsEvenIfWrong1564678844323 } from "migration/1564678844323-set_correct_values_for_award_points_even_if_wrong"

@Service()
export default class QuizAnswerService {
  @InjectManager()
  private entityManager: EntityManager

  private knex = Knex({ client: "pg" })

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

  public async getLatestAnswersForQuiz(quiz: Quiz, manager?: EntityManager) {
    const entityManager = manager || this.entityManager

    const latest = this.knex
      .select("id")
      .select(
        this.knex.raw(
          "row_number() over(partition by user_id, quiz_id order by created_at desc) rn",
        ),
      )
      .from("quiz_answer")
      .where({ quiz_id: quiz.id })
      .as("latest")

    const query = this.knex
      .select("id")
      .from(latest)
      .where("rn", 1)

    const result = await entityManager.query(query.toString())

    const ids = result.map((qa: any) => qa.id)

    return await entityManager
      .createQueryBuilder(QuizAnswer, "quiz_answer")
      .where("quiz_answer.id in (:...ids)", { ids })
      .getMany()
  }

  public async getAnswered(
    courseId: string,
    userId: number,
  ): Promise<AnsweredQuiz[]> {
    const query = this.knex.raw(
      `select
          q.id as quiz_id,
          coalesce(uqs.tries > 0, false) as answered,
          coalesce(uqs.points_awarded > 0, false) as correct
        from quiz q
        left join (
          select
            quiz_id,
            tries,
            points_awarded
          from user_quiz_state
          where user_id = :userId
        ) uqs
          on q.id = uqs.quiz_id
        where q.course_id = :courseId
        `,
      { courseId, userId },
    )

    return await this.entityManager.query(query.toString())
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

    someQuery
      .select("quiz_answer.quiz_id", "quizId")
      .addSelect("COUNT(*)")
      .addGroupBy("quiz_answer.quiz_id")

    const result = (await someQuery.execute()).map(
      (countInfo: { quizId: string; count: string }) => {
        return {
          ...countInfo,
          count: Number(countInfo.count),
        }
      },
    )

    if (!query.quizId) {
      return result
    }

    return result.length > 0 ? result[0] : {}
  }

  public async getPlainAnswers(quizId: string): Promise<any> {
    if (!validator.isUUID(quizId)) {
      return {}
    }

    const builder = Knex({ client: "pg" })

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
    const builder = Knex({ client: "pg" })

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
    const builder = Knex({ client: "pg" })

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

    const builder = Knex({ client: "pg" })

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

    let selectedFields: string[] = ["text_data", "int_data", "correct"]
    query = query
      .leftJoin(
        "quiz_option_answer",
        "quiz_option_answer.quiz_item_answer_id",
        "quiz_item_answer.id",
      )
      .leftJoin(
        "quiz_option",
        "quiz_option.id",
        "quiz_option_answer.quiz_option_id",
      )
      .leftJoin(
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
      minPeerReviewsGiven,
      maxPeerReviewsGiven,
      minPeerReviewsReceived,
      maxPeerReviewsReceived,
      quizRequiresPeerReviews,
      minSpamFlags,
      maxSpamFlags,
      minPeerReviewAverage,
      maxPeerReviewAverage,
      addPeerReviews,
      addSpamFlagNumber,
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
      typeof minPeerReviewsGiven !== "number" &&
      typeof maxPeerReviewsGiven !== "number" &&
      typeof minPeerReviewsReceived !== "number" &&
      typeof maxPeerReviewsReceived !== "number" &&
      typeof minSpamFlags !== "number" &&
      typeof maxSpamFlags !== "number" &&
      typeof minPeerReviewAverage !== "number" &&
      typeof maxPeerReviewAverage !== "number"
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
      (minPeerReviewsGiven != null || maxPeerReviewsGiven != null) &&
      quizId
    ) {
      userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
        "user_quiz_state",
      )
        .select("user_quiz_state.user_id")
        .where("user_quiz_state.quiz_id = :quizId", { quizId })

      if (minPeerReviewsGiven != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.peer_reviews_given >= :minPeerReviewsGiven",
          {
            minPeerReviewsGiven,
          },
        )
      }

      if (maxPeerReviewsGiven != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.peer_reviews_given <= :maxPeerReviewsGiven",
          {
            maxPeerReviewsGiven,
          },
        )
      }
    }

    if (
      (minPeerReviewsReceived != null || maxPeerReviewsReceived != null) &&
      quizId
    ) {
      if (!userIdsInSuitableUQStates) {
        userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
      }

      if (minPeerReviewsReceived != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.peer_reviews_received >= :minPeerReviewsReceived",
          { minPeerReviewsReceived },
        )
      }

      if (maxPeerReviewsReceived != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.peer_reviews_received <= :maxPeerReviewsReceived",
          { maxPeerReviewsReceived },
        )
      }
    }

    if (minSpamFlags != null || maxSpamFlags != null) {
      if (!userIdsInSuitableUQStates) {
        userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
      }

      if (minSpamFlags != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.spam_flags >= :minSpamFlags",
          { minSpamFlags },
        )
      }

      if (maxSpamFlags != null) {
        userIdsInSuitableUQStates.andWhere(
          "user_quiz_state.spam_flags <= :maxSpamFlags",
          { maxSpamFlags },
        )
      }
    }

    if (
      (minPeerReviewAverage != null || maxPeerReviewAverage != null) &&
      quizId
    ) {
      if (!userIdsInSuitableUQStates) {
        userIdsInSuitableUQStates = await UserQuizState.createQueryBuilder(
          "user_quiz_state",
        )
          .select("user_quiz_state.user_id")
          .where("user_quiz_state.quiz_id = :quizId", { quizId })
      }

      throw new Error("Filtering by average not supported yet!")
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

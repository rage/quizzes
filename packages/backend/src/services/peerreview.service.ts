import knex from "knex"
import _ from "lodash"
import { Service, Inject } from "typedi"
import { Brackets, EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  SpamFlag,
  UserQuizState,
} from "../models"
import { randomUUID } from "../util"
import KafkaService from "./kafka.service"
import QuizAnswerService from "./quizanswer.service"
import UserCoursePartStateService from "./usercoursepartstate.service"
import UserQuizStateService from "./userquizstate.service"
import ValidationService from "./validation.service"

@Service()
export default class PeerReviewService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private validationService: ValidationService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  @Inject()
  private kafkaService: KafkaService

  public async processPeerReview(
    manager: EntityManager,
    quiz: Quiz,
    quizAnswer: QuizAnswer,
    giving?: boolean,
  ) {
    const userId = quizAnswer.userId

    const userQuizState = await this.userQuizStateService.getUserQuizState(
      userId,
      quizAnswer.quizId,
      manager,
    )

    if (giving) {
      userQuizState.peerReviewsGiven += 1
    } else {
      userQuizState.peerReviewsReceived += 1
    }

    const originalPoints = userQuizState.pointsAwarded

    const peerReviews = await this.getPeerReviews(manager, quizAnswer.id)

    const {
      quizAnswer: validatedAnswer,
      userQuizState: validatedState,
    } = this.validationService.validateEssayAnswer(
      quiz,
      quizAnswer,
      userQuizState,
      peerReviews,
    )

    const updatedAnswer: QuizAnswer = await this.quizAnswerService.createQuizAnswer(
      manager,
      validatedAnswer,
    )
    const updatedState = await this.userQuizStateService.createUserQuizState(
      manager,
      validatedState,
    )

    if (
      updatedState.pointsAwarded > originalPoints &&
      !quiz.excludedFromScore
    ) {
      await this.userCoursePartStateService.updateUserCoursePartState(
        manager,
        quiz,
        userId,
      )
      await this.kafkaService.publishUserProgressUpdated(
        manager,
        userId,
        quiz.courseId,
      )
    }

    this.kafkaService.publishQuizAnswerUpdated(
      updatedAnswer,
      updatedState,
      quiz,
    )

    return {
      answer: updatedAnswer,
      state: updatedState,
    }
  }

  public async createPeerReview(
    manager: EntityManager,
    peerReview: PeerReview,
  ) {
    return await manager.save(peerReview)
  }

  public async getPeerReviews(
    manager: EntityManager,
    quizAnswerId: string,
    onlyGrades: boolean = true,
  ) {
    let builtQuery = manager
      .createQueryBuilder(PeerReview, "peer_review")
      .innerJoinAndSelect("peer_review.answers", "peer_review_question_answer")
      .innerJoin(
        "peer_review_question_answer.peerReviewQuestion",
        "peer_review_question",
      )
      .where("peer_review.quiz_answer_id = :quizAnswerId", { quizAnswerId })

    if (onlyGrades) {
      builtQuery = builtQuery.andWhere("peer_review_question.type = :type", {
        type: "grade",
      })
    }

    return await builtQuery.getMany()
  }

  public async getPlainPeerReviews(quizId: string) {
    const builder = knex({ client: "pg" })

    const query = builder("peer_review")
      .innerJoin("quiz_answer", "quiz_answer.id", "peer_review.quiz_answer_id")
      .where("quiz_answer.quiz_id", quizId)
      .select(
        "peer_review.id",
        "peer_review.quiz_answer_id",
        "peer_review.user_id",
        "peer_review.rejected_quiz_answer_ids",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()
    const data = await queryRunner.stream(query.toString())
    await queryRunner.release()

    return data
  }

  public async getPlainPeerReviewAnswers(quizId: string) {
    const builder = knex({ client: "pg" })

    const query = builder("peer_review")
      .innerJoin("quiz_answer", "quiz_answer.id", "peer_review.quiz_answer_id")
      .where("quiz_answer.quiz_id", quizId)
      .innerJoin(
        "peer_review_question_answer",
        "peer_review_question_answer.peer_review_id",
        "peer_review.id",
      )
      .select(
        { peer_review_id: "peer_review.id" },
        "peer_review_question_answer.peer_review_question_id",
        "peer_review_question_answer.value",
        "peer_review_question_answer.text",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    const data = await queryRunner.stream(query.toString())
    await queryRunner.release()
    return data
  }

  public async getCSVData(quizId: string) {
    const builder = knex({ client: "pg" })

    const query = builder("peer_review")
      .innerJoin("quiz_answer", "quiz_answer.id", "peer_review.quiz_answer_id")
      .where("quiz_answer.quiz_id", quizId)
      .select(
        "peer_review.id",
        "peer_review.quiz_answer_id",
        "peer_review.user_id",
        "peer_review.rejected_quiz_answer_ids",
      )
      .innerJoin(
        "peer_review_question_answer",
        "peer_review_question_answer.peer_review_id",
        "peer_review.id",
      )
      .select(
        "peer_review_question_answer.peer_review_question_id",
        "peer_review_question_answer.value",
        "peer_review_question_answer.text",
      )

    const queryRunner = this.entityManager.connection.createQueryRunner()
    queryRunner.connect()

    const data = await queryRunner.stream(query.toString())
    await queryRunner.release()
    return data
  }

  public async getAnswersToReview(
    quizId: string,
    languageId: string,
    reviewerId: number,
  ): Promise<QuizAnswer[]> {
    const givenPeerReviews: PeerReview[] = await this.entityManager
      .createQueryBuilder(PeerReview, "peer_review")
      .innerJoin(
        QuizAnswer,
        "quiz_answer",
        "peer_review.quiz_answer_id = quiz_answer.id",
      )
      .where("peer_review.user_id = :reviewerId", { reviewerId })
      .andWhere("quiz_answer.quiz_id = :quizId", { quizId })
      .getMany()

    const givenSpamFlags: SpamFlag[] = await this.entityManager
      .createQueryBuilder(SpamFlag, "spam_flag")
      .where("spam_flag.user_id = :reviewerId", { reviewerId })
      .getMany()

    const rejected: string[] = [].concat(
      ...givenPeerReviews.map(pr => pr.rejectedQuizAnswerIds),
      ...givenSpamFlags.map(spamFlag => spamFlag.quizAnswerId),
    )
    // query will fail if this array is empty
    rejected.push(randomUUID())

    const alreadyReviewed = givenPeerReviews.map(pr => pr.quizAnswerId)
    alreadyReviewed.push(randomUUID())

    let candidates: QuizAnswer[] = await this.getCandidates(
      quizId,
      languageId,
      reviewerId,
      rejected,
      alreadyReviewed,
      false,
    )

    let includeThis: QuizAnswer[] = []

    if (candidates.length < 2) {
      includeThis = candidates
      candidates = await this.getCandidates(
        quizId,
        languageId,
        reviewerId,
        rejected,
        alreadyReviewed,
        true,
      )
    }

    candidates = _.shuffle(candidates)
    candidates = candidates.sort(
      (a, b): number => {
        if (a.status < b.status) {
          return 1
        } else if (a.status > b.status) {
          return -1
        } else {
          return 0
        }
      },
    )

    if (includeThis.length === 1) {
      return [...includeThis, ...candidates.slice(0, 1)]
    }

    return candidates.slice(0, 2)
  }

  private async getCandidates(
    quizId: string,
    languageId: string,
    reviewerId: number,
    rejected: string[],
    alreadyReviewed: string[],
    includeNonPriority: boolean,
  ) {
    const builder = knex({ client: "pg" })

    const limitingQuery = builder("user_quiz_state")
      .select("user_id")
      .join("quiz", "user_quiz_state.quiz_id", "quiz.id")
      .join("course", "quiz.course_id", "course.id")
      .where("quiz_id", quizId)
      .modify(qb => {
        if (includeNonPriority) {
          qb.where("points_awarded", ">", 0).andWhere(
            builder.raw(
              "peer_reviews_received = course.min_peer_reviews_received",
            ),
          )
        } else {
          qb.whereNull("points_awarded")
            .andWhere(
              builder.raw(
                "peer_reviews_given >= course.min_peer_reviews_given",
              ),
            )
            .andWhere(
              builder.raw(
                "peer_reviews_received < course.min_peer_reviews_received",
              ),
            )
            .andWhere(builder.raw("spam_flags <= max_spam_flags"))
        }
      })

    const query = builder("quiz_answer")
      .select(
        builder.raw(`
        quiz_answer.id
      `),
      )
      .joinRaw(
        `
        INNER JOIN user_quiz_state
        ON quiz_answer.user_id = user_quiz_state.user_id
        AND quiz_answer.quiz_id = user_quiz_state.quiz_id
      `,
      )
      .where("quiz_answer.quiz_id", quizId)
      .andWhere("quiz_answer.user_id", "!=", reviewerId)
      .andWhere("quiz_answer.user_id", "in", limitingQuery)
      .andWhere("quiz_answer.id", "not in", rejected)
      .andWhere("quiz_answer.id", "not in", alreadyReviewed)
      .andWhere("quiz_answer.language_id", languageId)
      .andWhere("quiz_answer.status", "not in", [
        "deprecated",
        "rejected",
        "spam",
      ])
      .orderByRaw(
        `
        quiz_answer.status ASC,
        user_quiz_state.peer_reviews_given DESC,
        quiz_answer.created_at ASC,
        user_quiz_state.peer_reviews_received ASC
      `,
      )
      .limit(20)
      .toString()

    const ids = (await this.entityManager.query(query)).map((qa: any) => qa.id)

    if (ids.length === 0) {
      return []
    }

    return await this.entityManager
      .createQueryBuilder(QuizAnswer, "quiz_answer")
      .where("quiz_answer.id in (:...ids)", { ids })
      .getMany()
  }
}

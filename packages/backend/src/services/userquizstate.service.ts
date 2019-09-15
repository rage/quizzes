import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  PeerReview,
  PeerReviewCollection,
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  SpamFlag,
  User,
  UserQuizState,
} from "../models"
import QuizAnswerService from "./quizanswer.service"

@Service()
export default class UserQuizStateService {
  @InjectManager()
  private entityManager: EntityManager

  public async getUserQuizState(
    userId: number,
    quizId: string,
    manager?: EntityManager,
  ): Promise<UserQuizState | undefined> {
    const entityManager = manager || this.entityManager

    return await entityManager
      .createQueryBuilder(UserQuizState, "userQuizState")
      .where("user_id = :userId and quiz_id = :quizId", { userId, quizId })
      .getOne()
  }

  public async getUserQuizStatesByQuiz(
    quiz: Quiz,
    manager?: EntityManager,
  ): Promise<UserQuizState[]> {
    const entityManager = manager || this.entityManager

    return await entityManager
      .createQueryBuilder(UserQuizState, "userQuizState")
      .where("quiz_id = :quizId", { quizId: quiz.id })
      .getMany()
  }

  public async createUserQuizState(
    manager: EntityManager,
    userQuizState: UserQuizState,
  ): Promise<UserQuizState> {
    return await manager.save(userQuizState)
  }

  public async createAndCompleteUserQuizState(
    manager: EntityManager,
    userQuizState: UserQuizState,
  ): Promise<UserQuizState> {
    if (!userQuizState.userId || !userQuizState.quizId) {
      return null
    }

    const quizAnswerIds = await manager
      .createQueryBuilder(QuizAnswer, "quiz_answer")
      .select("quiz_answer.id")
      .where("quiz_answer.quiz_id = :quiz_id", {
        quiz_id: userQuizState.quizId,
      })
      .andWhere("quiz_answer.user_id = :user_id", {
        user_id: userQuizState.userId,
      })

    if (
      typeof userQuizState.spamFlags !== "number" &&
      !userQuizState.spamFlags
    ) {
      userQuizState.spamFlags = (await manager
        .createQueryBuilder(SpamFlag, "spam_flag")
        .select("COUNT(*)")
        .where("spam_flag.quiz_answer_id IN (" + quizAnswerIds.getQuery() + ")")
        .setParameters(quizAnswerIds.getParameters())
        .getRawOne()).count
    }
    if (
      typeof userQuizState.peerReviewsGiven !== "number" &&
      !userQuizState.peerReviewsGiven
    ) {
      userQuizState.peerReviewsGiven = (await manager
        .createQueryBuilder(PeerReview, "peer_review")
        .select("COUNT(*)")
        .leftJoin(
          PeerReviewCollection,
          "peer_review_collection",
          "peer_review_collection.id = peer_review.peer_review_collection_id",
        )
        .where("peer_review.user_id = :user_id", {
          user_id: userQuizState.userId,
        })
        .andWhere("peer_review_collection.quiz_id = :quiz_id", {
          quiz_id: userQuizState.quizId,
        })
        .getRawOne()).count
    }

    if (
      typeof userQuizState.peerReviewsReceived !== "number" &&
      !userQuizState.peerReviewsReceived
    ) {
      userQuizState.peerReviewsReceived = (await manager
        .createQueryBuilder(PeerReview, "peer_review")
        .select("COUNT(*)")
        .where(
          "peer_review.quiz_answer_id IN (" + quizAnswerIds.getQuery() + ")",
        )
        .setParameters(quizAnswerIds.getParameters())
        .getRawOne()).count
    }

    if (!userQuizState.status) {
      userQuizState.status = "locked"
    }

    if (typeof userQuizState.tries !== "number" || userQuizState.tries === 0) {
      userQuizState.tries = (await manager
        .createQueryBuilder(QuizAnswer, "quiz_answer")
        .select("COUNT(*)")
        .where("quiz_answer.quiz_id = :quiz_id", {
          quiz_id: userQuizState.quizId,
        })
        .andWhere("quiz_answer.user_id = :user_id", {
          user_id: userQuizState.userId,
        })
        .getRawOne()).count
    }

    return await manager.save(userQuizState)
  }

  public async getQuizStatesForUserCourse(
    manager: EntityManager,
    userId: number,
    quizIds: string[],
  ): Promise<UserQuizState[]> {
    return await manager
      .createQueryBuilder(UserQuizState, "user_quiz_state")
      .innerJoin(
        QuizAnswer,
        "quiz_answer",
        "user_quiz_state.user_id = quiz_answer.user_id and user_quiz_state.quiz_id = quiz_answer.quiz_id",
      )
      .innerJoin(Quiz, "quiz", "user_quiz_state.quiz_id = quiz.id")
      .where("user_quiz_state.user_id = :userId", { userId })
      .andWhere("user_quiz_state.quiz_id in (:...quizIds)", { quizIds })
      .andWhere("quiz_answer.status = 'confirmed'")
      .orderBy("quiz_answer.updated_at", "DESC")
      .getMany()
  }

  public async updatePointsForQuiz(
    quiz: Quiz,
    oldQuiz: Quiz,
    manager?: EntityManager,
  ) {
    const entityManager = manager || this.entityManager

    const maxPoints = quiz.points
    const oldMaxPoints = oldQuiz.points

    await entityManager.query(`
      update user_quiz_state
      set points_awarded = ((points_awarded * ${maxPoints}) / ${oldMaxPoints})
      where quiz_id = '${quiz.id}'
    `)
  }
}

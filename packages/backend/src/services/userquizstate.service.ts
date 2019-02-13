import {
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  User,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { WhereBuilder } from "@quizzes/common/util"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"

@Service()
export default class UserQuizStateService {
  @InjectManager()
  private entityManager: EntityManager

  public async getUserQuizState(
    userId: number,
    quizId: string,
  ): Promise<UserQuizState | undefined> {
    return await this.entityManager
      .createQueryBuilder(UserQuizState, "userQuizState")
      .where("user_id = :userId and quiz_id = :quizId", { userId, quizId })
      .getOne()
  }

  public async createUserQuizState(
    manager: EntityManager,
    userQuizState: UserQuizState,
  ): Promise<UserQuizState> {
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
}

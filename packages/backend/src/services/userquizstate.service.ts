import {
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
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

  public async getUserQuizState(userId: number, quizId: string) {
    return await this.entityManager
      .createQueryBuilder(UserQuizState, "userQuizState")
      .where("user_id = :userId and quiz_id = :quizId", { userId, quizId })
      .getOne()
  }

  public async createUserQuizState(userQuizState: UserQuizState) {
    await this.entityManager.save(userQuizState)
  }
}

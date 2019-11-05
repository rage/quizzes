import { Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
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
import { IQuizAnswerQuery } from "../types"

@Service()
export default class SpamFlagService {
  @InjectManager()
  private entityManager: EntityManager

  public async createSpamFlag(manager: EntityManager, spamFlag: SpamFlag) {
    if (!spamFlag) {
      return
    }
    return manager.save(spamFlag)
  }

  public async getSpamFlag(
    userId: number,
    quizAnswerId: string,
  ): Promise<SpamFlag> {
    return await this.entityManager
      .createQueryBuilder(SpamFlag, "spam_flag")
      .where("spam_flag.user_id = :userId", { userId })
      .andWhere("spam_flag.quiz_answer_id = :quizAnswerId", { quizAnswerId })
      .getOne()
  }
}

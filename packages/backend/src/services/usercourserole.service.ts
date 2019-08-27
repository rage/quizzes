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
  UserCourseRole,
} from "../models"
import QuizAnswerService from "./quizanswer.service"

@Service()
export default class UserCourseRoleService {
  @InjectManager()
  private entityManager: EntityManager

  public async getUserCourseRoles(
    userId: number,
    courseId: string,
    manager?: EntityManager,
  ): Promise<UserCourseRole[] | undefined> {
    const entityManager = manager || this.entityManager

    return await entityManager
      .createQueryBuilder(UserCourseRole, "userCourseRole")
      .where("user_id = :userId", { userId })
      .andWhere("course_id = :courseId", { courseId })
      .getMany()
  }
}

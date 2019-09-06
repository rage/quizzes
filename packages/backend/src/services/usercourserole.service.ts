import { Service } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { Course, Quiz, UserCourseRole } from "../models"
import { CourseTranslation } from "@quizzes/common/models"

@Service()
export default class UserCourseRoleService {
  public async getUserCourseRoles({
    userId,
    courseId,
    quizId,
  }: {
    userId: number
    courseId?: string
    quizId?: string
  }): Promise<UserCourseRole[] | undefined> {
    const queryBuilder = UserCourseRole.createQueryBuilder("ucr").where(
      "ucr.user_id = :userId",
      { userId },
    )

    queryBuilder
      .innerJoinAndSelect("ucr.course", "course")
      .innerJoinAndSelect("course.texts", "text")

    if (courseId) {
      queryBuilder.andWhere("ucr.course_id = :courseId", { courseId })
    } else if (quizId) {
      queryBuilder
        .innerJoin(Quiz, "quiz", "course.id = quiz.course_id")
        .where("quiz.id = :quizId", { quizId })
    }
    return await queryBuilder.getMany()
  }

  public async getRolesCount(userId: number): Promise<number> {
    const result = await UserCourseRole.createQueryBuilder("ucr")
      .where("user_id = :userId", { userId })
      .getCount()
    return result
  }
}

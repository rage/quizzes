import { Service } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { UserCourseRole } from "../models"

@Service()
export default class UserCourseRoleService {
  public async getUserCourseRoles(
    userId: number,
    courseId?: string,
  ): Promise<UserCourseRole[] | undefined> {
    const queryBuilder = UserCourseRole.createQueryBuilder(
      "userCourseRole",
    ).where("user_id = :userId", { userId })

    if (courseId) {
      queryBuilder.andWhere("course_id = :courseId", { courseId })
    }

    return await queryBuilder.getMany()
  }
}

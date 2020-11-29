import BaseModel from "./base_model"
import User from "./user"

class UserCourseRole extends BaseModel {
  userId!: string
  courseId!: string
  role!: string
  static get tableName() {
    return "user_course_role"
  }
  static relationMappings = {
    user: {
      relation: BaseModel.HasOneRelation,
      modelClass: User,
      join: {
        from: "user_course_role.user_id",
        to: "user.id",
      },
    },
  }
  public static async getByUserId(userId: number) {
    return await this.query().where("user_id", userId)
  }

  public static async getByUserIdAndCourseId(userId: number, courseId: string) {
    return await this.query().where({ user_id: userId, course_id: courseId })
  }
}

export default UserCourseRole

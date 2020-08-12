import Model from "./base_model"
import User from "./user"

class UserCourseRole extends Model {
  userId!: string
  courseId!: string
  role!: string
  static get tableName() {
    return "user_course_role"
  }
  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
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
}

export default UserCourseRole

import Model from "./base_model"
import User from "./user"

class UserCourseRole extends Model {
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
}

export default UserCourseRole

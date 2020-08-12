import Model from "./base_model"
import QuizAnswer from "./quiz_answer"
import UserCourseRole from "./user_course_role"

class User extends Model {
  roles!: UserCourseRole[]

  static get tableName() {
    return "user"
  }

  static relationMappings = {
    answers: {
      relation: Model.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: "user.id",
        to: "quiz_answer.user_id",
      },
    },
    roles: {
      relation: Model.HasManyRelation,
      modelClass: UserCourseRole,
      join: {
        from: "user.id",
        to: "user_course_role.user_id",
      },
    },
  }
}

export default User

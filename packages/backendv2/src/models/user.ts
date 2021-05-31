import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import UserCourseRole, { UserCourseRoleType } from "./user_course_role"
import Knex from "knex"
import BaseModel from "./base_model"

import { ModelObject } from "objection"

class User extends BaseModel {
  id!: number
  roles!: UserCourseRole[]

  static get tableName() {
    return "user"
  }

  static relationMappings = {
    answers: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: "user.id",
        to: "quiz_answer.user_id",
      },
    },
    userQuizStates: {
      relation: BaseModel.HasManyRelation,
      modelClass: UserQuizState,
      join: {
        from: "user.id",
        to: "user_quiz_state.user_id",
      },
    },
    roles: {
      relation: BaseModel.HasManyRelation,
      modelClass: UserCourseRole,
      join: {
        from: "user.id",
        to: "user_course_role.user_id",
      },
    },
  }

  public static async getById(
    id: number,
    trx?: Knex.Transaction,
  ): Promise<User> {
    return await this.query(trx).findById(id)
  }
}

export type UserType = ModelObject<User>

export default User

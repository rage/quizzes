import knex from "../../../database/knex"
import { UserCourseRole } from "../../models"
import { UserInfo } from "../../types"
import { ForbiddenError } from "../../util/error"

const abilitiesToRoles = {
  teacher: ["edit"],
}

export const checkAccessOrThrow = async (
  userInfo: UserInfo,
  courseId?: string,
  operation?: string,
) => {
  if (userInfo.administrator) {
    return
  }
  if (courseId && operation) {
    const role = (
      await UserCourseRole.query()
        .where("user_id", userInfo.id)
        .andWhere("course_id", courseId)
    )[0]?.role
    if (role && abilitiesByRole[role]?.includes(operation)) {
      return
    }
  }
  throw new ForbiddenError("forbidden")
}

const abilitiesByRole: { [role: string]: string[] } = {
  assistant: ["view", "edit", "grade"],
  teacher: ["view", "edit", "grade"],
}

export const getCourseIdByAnswerId = async (answerId: string) => {
  return (
    await knex("quiz")
      .select("course_id")
      .innerJoin("quiz_answer", "quiz.id", "quiz_answer.quiz_id")
      .where("quiz_answer.id", answerId)
  )[0].course_id
}

export const getCourseIdByQuizId = async (quizId: string) => {
  return (
    await knex("quiz")
      .select("course_id")
      .where("quiz.id", quizId)
  )[0].course_id
}

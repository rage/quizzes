import crypto from "crypto"
import { NotFoundError } from "./../../util/error"
import knex from "../../../database/knex"
import { UserCourseRole, Course } from "../../models"
import { UserInfo } from "../../types"
import { ForbiddenError } from "../../util/error"
import redis from "../../../config/redis"

export const checkAccessOrThrow = async (
  userInfo: UserInfo,
  courseId: string,
  operation: string,
) => {
  if (courseId && operation) {
    const role = userInfo.administrator
      ? "admin"
      : (
          await UserCourseRole.query()
            .where("user_id", userInfo.id)
            .andWhere("course_id", courseId)
            .limit(1)
        )[0]?.role || "none"
    if (abilitiesByRole[role]?.includes(operation)) {
      return
    }
  }
  throw new ForbiddenError("forbidden")
}

export const getAccessibleCourses = async (
  userInfo: UserInfo,
  operation: string,
) => {
  if (userInfo.administrator) {
    return await Course.getAll()
  }
  const userCourseRoles = await UserCourseRole.getByUserId(userInfo.id)
  const courses = await Promise.all(
    userCourseRoles.map(async userCourseRole => {
      if (abilitiesByRole[userCourseRole.role]?.includes(operation)) {
        return await Course.getById(userCourseRole.courseId)
      }
    }),
  )
  if (courses.length === 0) {
    throw new ForbiddenError("forbidden")
  }
  return courses
}

export const abilitiesByRole: { [role: string]: string[] } = {
  admin: ["view", "edit", "grade", "download", "duplicate", "delete-answer"],
  assistant: ["view", "edit", "grade", "delete-answer"],
  teacher: ["view", "edit", "grade", "delete-answer"],
  reviewer: ["view", "grade"],
}

export const getCourseIdByAnswerId = async (answerId: string) => {
  let courses
  try {
    courses = await knex("quiz")
      .select("course_id")
      .innerJoin("quiz_answer", "quiz.id", "quiz_answer.quiz_id")
      .where("quiz_answer.id", answerId)
  } catch (error) {
    throw error
  }

  if (courses[0]) {
    return courses[0].course_id
  } else {
    throw new NotFoundError(`No course found for answer id: ${answerId}`)
  }
}

export const getCourseIdByQuizId = async (quizId: string) => {
  return (
    await knex("quiz")
      .select("course_id")
      .where("quiz.id", quizId)
  )[0].course_id
}

export const getDownloadTokenFromRedis = async (
  userId: string,
): Promise<string> => {
  let downloadToken = ""
  if (redis.client) {
    try {
      const cachedToken = await redis.client.get(userId)
      if (cachedToken) {
        downloadToken = cachedToken
      } else {
        const randomToken = `dl_tkn_${crypto.randomBytes(100).toString("hex")}`
        await redis.client.set(userId, randomToken, "EX", 600)
        downloadToken = randomToken
      }
    } catch (error) {
      console.error(
        "Redis operation failed in getDownloadTokenFromRedis:",
        error,
      )
    }
  }
  // will return empty string if redis unavailable
  return downloadToken
}

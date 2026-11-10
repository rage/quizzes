import crypto from "crypto"

import redis from "../../../config/redis"
import knex from "../../../database/knex"
import { UserCourseRole, Course } from "../../models"
import { AuthenticatedUser } from "../../types"
import { ForbiddenError } from "../../util/error"
import { NotFoundError } from "./../../util/error"

export const checkAccessOrThrow = async (
  userInfo: AuthenticatedUser,
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
  userInfo: AuthenticatedUser,
  operation: string,
) => {
  if (userInfo.administrator) {
    return await Course.getAll()
  }
  const userCourseRoles = await UserCourseRole.getByUserId(userInfo.id)
  const courses = await Promise.all(
    userCourseRoles.map(async (userCourseRole) => {
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

/**
 * Returns the distinct courses the given answers belong to.
 * Throws NotFoundError if any answer does not exist.
 */
export const getCourseIdsByAnswerIds = async (
  answerIds: string[],
): Promise<string[]> => {
  const rows: { answer_id: string; course_id: string }[] = await knex("quiz")
    .select("quiz_answer.id as answer_id", "quiz.course_id")
    .innerJoin("quiz_answer", "quiz.id", "quiz_answer.quiz_id")
    .whereIn("quiz_answer.id", answerIds)
  const foundAnswerIds = new Set(rows.map((row) => row.answer_id))
  const missingAnswerId = answerIds.find((id) => !foundAnswerIds.has(id))
  if (missingAnswerId) {
    throw new NotFoundError(`No course found for answer id: ${missingAnswerId}`)
  }
  return [...new Set(rows.map((row) => row.course_id))]
}

export const getCourseIdByAnswerId = async (answerId: string) =>
  (await getCourseIdsByAnswerIds([answerId]))[0]

export const getCourseIdByQuizId = async (quizId: string): Promise<string> => {
  const quiz = await knex("quiz")
    .select("course_id")
    .where("quiz.id", quizId)
    .first()
  if (!quiz) {
    throw new NotFoundError(`quiz not found: ${quizId}`)
  }
  return quiz.course_id
}

export type DownloadKind = "quiz-info" | "peerreview-info" | "answer-info"

interface DownloadGrant {
  quizId: string
  kind: DownloadKind
}

const DOWNLOAD_TOKEN_TTL_SECONDS = 600

const downloadTokenKey = (token: string) => `download-token:${token}`

/**
 * Issues a single-use token for downloading one quiz's CSV of one kind; redeem
 * it with `consumeDownloadToken`. Returns "" when Redis is unavailable.
 */
export const createDownloadToken = async (
  quizId: string,
  kind: DownloadKind,
): Promise<string> => {
  if (!redis.client) {
    return ""
  }
  const token = `dl_tkn_${crypto.randomBytes(32).toString("hex")}`
  const grant: DownloadGrant = { quizId, kind }
  try {
    await redis.client.set(
      downloadTokenKey(token),
      JSON.stringify(grant),
      "EX",
      DOWNLOAD_TOKEN_TTL_SECONDS,
    )
  } catch (error) {
    console.error("Redis operation failed in createDownloadToken:", error)
    return ""
  }
  return token
}

/**
 * Redeems a token from `createDownloadToken`, deleting it whether or not it
 * matches. Returns true only if it was issued for this quiz and kind.
 */
export const consumeDownloadToken = async (
  token: string,
  quizId: string,
  kind: DownloadKind,
): Promise<boolean> => {
  if (!redis.client) {
    return false
  }
  const key = downloadTokenKey(token)
  // MULTI GET+DEL instead of GETDEL, which production's Redis 4 lacks.
  const results = await redis.client.multi().get(key).del(key).exec()
  const stored = results?.[0]?.[1]
  if (typeof stored !== "string") {
    return false
  }
  const grant = JSON.parse(stored) as DownloadGrant
  return grant.quizId === quizId && grant.kind === kind
}

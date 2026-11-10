import Router from "@koa/router"

import knex from "../../../../database/knex"
import accessControl from "../../../middleware/access_control"
import { QuizAnswer, QuizAnswerStatusModification } from "../../../models"
import type { QuizAnswerStatus } from "../../../models/quiz_answer"
import { CustomState, CustomContext } from "../../../types"
import { BadRequestError } from "../../../util/error"
import {
  getCourseIdByAnswerId,
  checkAccessOrThrow,
  getCourseIdByQuizId,
  getCourseIdsByAnswerIds,
} from "../util"

const getStatusChangeOperation = (
  status: string,
  plagiarismSuspected: boolean,
) => {
  return plagiarismSuspected
    ? "teacher-suspects-plagiarism"
    : status === "confirmed"
      ? "teacher-accept"
      : "teacher-reject"
}

type PaginationQuery = Partial<
  Record<
    "page" | "size" | "order" | "filters" | "deleted" | "notDeleted",
    string
  >
>

const MAX_PAGE_SIZE = 100

const parseInteger = (
  value: string | undefined,
  name: string,
  fallback: number,
) => {
  if (value === undefined) {
    return fallback
  }
  const parsed = Number(value)
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    !Number.isFinite(parsed)
  ) {
    throw new BadRequestError(`Invalid ${name}: ${value}`)
  }
  return Math.floor(parsed)
}

const parsePage = (page?: string) => Math.max(parseInteger(page, "page", 0), 0)

const parsePageSize = (size?: string) =>
  Math.min(
    Math.max(parseInteger(size, "size", MAX_PAGE_SIZE), 1),
    MAX_PAGE_SIZE,
  )

const parseFilters = (filters?: string) => (filters ? filters.split(",") : [])

const parseOrder = (order?: string) => (order === "desc" ? "desc" : "asc")

const answersRoutes = new Router<CustomState, CustomContext>({
  prefix: "/answers",
})
  .post("/:answerId/status", accessControl(), async (ctx) => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "grade")
    const { status, plagiarismSuspected } = ctx.request.body as {
      status: QuizAnswerStatus
      plagiarismSuspected: boolean
    }
    const modifierId = ctx.state.user.id

    const quizAnswer = await QuizAnswer.setManualReviewStatus(answerId, status)

    // log status change
    const operation = getStatusChangeOperation(status, plagiarismSuspected)

    await knex.transaction(
      async (trx) =>
        await QuizAnswerStatusModification.logStatusChange(
          answerId,
          operation,
          trx,
          modifierId,
        ),
    )

    ctx.body = quizAnswer
  })

  .post("/status", accessControl(), async (ctx) => {
    const { status, answerIds, plagiarismSuspected } = ctx.request.body as {
      status: QuizAnswerStatus
      answerIds?: string[]
      plagiarismSuspected: boolean
    }
    const modifierId = ctx.state.user.id

    if (!Array.isArray(answerIds) || !answerIds[0]) {
      throw new BadRequestError("No answer ids provided.")
    }
    if (!answerIds.every((id) => typeof id === "string")) {
      throw new BadRequestError("Answer ids must be strings.")
    }

    for (const courseId of await getCourseIdsByAnswerIds(answerIds)) {
      await checkAccessOrThrow(ctx.state.user, courseId, "grade")
    }
    const quizAnswers = await QuizAnswer.setManualReviewStatusForMany(
      answerIds,
      status,
    )

    const operation = getStatusChangeOperation(status, plagiarismSuspected)

    await knex.transaction(
      async (trx) =>
        await QuizAnswerStatusModification.logStatusChangeForMany(
          answerIds,
          operation,
          trx,
          modifierId,
        ),
    )

    ctx.body = quizAnswers
  })

  .get("/:answerId", accessControl(), async (ctx) => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getByIdWithPeerReviews(answerId)
  })

  .get("/:quizId/all", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order, filters, deleted, notDeleted } = ctx.request
      .query as PaginationQuery

    ctx.body = await QuizAnswer.getPaginatedByQuizId(
      quizId,
      parsePage(page),
      parsePageSize(size),
      parseOrder(order),
      parseFilters(filters),
      deleted === "true",
      notDeleted === "true",
    )
  })

  .post("/:quizId/all", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)

    await checkAccessOrThrow(ctx.state.user, courseId, "view")

    const { size, order, filters } = ctx.request.query as PaginationQuery

    const { searchQuery } = ctx.request.body as { searchQuery: string }

    ctx.body = await QuizAnswer.getPaginatedByQuizIdAndSearchQuery(
      quizId,
      parsePageSize(size),
      parseOrder(order),
      parseFilters(filters),
      searchQuery,
    )
  })

  .get("/:quizId/manual-review", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order } = ctx.request.query as PaginationQuery
    ctx.body = await QuizAnswer.getPaginatedManualReview(
      quizId,
      parsePage(page),
      parsePageSize(size),
      parseOrder(order),
    )
  })

  .post("/:quizId/manual-review", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { size, order } = ctx.request.query as PaginationQuery
    const { searchQuery } = ctx.request.body as { searchQuery: string }
    ctx.body = await QuizAnswer.getPaginatedManualReviewBySearchQuery(
      quizId,
      parsePageSize(size),
      parseOrder(order),
      searchQuery,
    )
  })

  .delete("/:answerId", accessControl(), async (ctx) => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "delete-answer")
    const quizAnswer = await QuizAnswer.query().findById(answerId)
    if (quizAnswer?.deleted) {
      ctx.body = quizAnswer
    } else {
      ctx.body = await QuizAnswer.deleteAnswer(answerId)
    }
  })

  .get("/:answerId/status-changes", accessControl(), async (ctx) => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswerStatusModification.getAllByQuizAnswerId(answerId)
  })

  .post(
    "/answers/:answerId/suspect-plagiarism",
    accessControl(),
    async (ctx) => {
      const answerId = ctx.params.answerId
      const courseId = await getCourseIdByAnswerId(answerId)
      const userId = ctx.state.user.id
      await checkAccessOrThrow(ctx.state.user, courseId, "view")

      ctx.body = await knex.transaction(
        async (trx) =>
          await QuizAnswerStatusModification.logStatusChange(
            answerId,
            "teacher-suspects-plagiarism",
            trx,
            userId,
          ),
      )
    },
  )

export default answersRoutes

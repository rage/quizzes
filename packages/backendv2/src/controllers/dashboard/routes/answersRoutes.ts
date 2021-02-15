import Router from "koa-router"
import accessControl from "../../../middleware/access_control"
import { QuizAnswer } from "../../../models"
import { CustomState, CustomContext } from "../../../types"
import { BadRequestError } from "../../../util/error"
import {
  getCourseIdByAnswerId,
  checkAccessOrThrow,
  getCourseIdByQuizId,
} from "../util"

const answersRoutes = new Router<CustomState, CustomContext>({
  prefix: "/answers",
})
  .post("/:answerId/status", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    const status = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatus(answerId, status)
  })

  .post("/status", accessControl(), async ctx => {
    const answerIds = ctx.request.body.answerIds

    if (!answerIds || !answerIds[0]) {
      throw new BadRequestError("No answer ids provided.")
    }
    let courseId
    try {
      courseId = await getCourseIdByAnswerId(answerIds[0])
    } catch (error) {
      throw error
    }

    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    const status = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatusForMany(answerIds, status)
  })

  .get("/:answerId", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getByIdWithPeerReviews(answerId)
  })

  .get("/:quizId/all", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order, filters } = ctx.request.query
    let parsedFilters = []
    if (filters && filters.length === 1) {
      parsedFilters = filters
    }
    if (filters && filters.length > 1) {
      parsedFilters = filters.split(",")
    }

    ctx.body = await QuizAnswer.getPaginatedByQuizId(
      quizId,
      page,
      size,
      order,
      parsedFilters,
    )
  })

  .post("/:quizId/all", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)

    await checkAccessOrThrow(ctx.state.user, courseId, "view")

    const { size, order, filters } = ctx.request.query

    const { searchQuery } = ctx.request.body

    let parsedFilters = []
    if (filters && filters.length === 1) {
      parsedFilters = filters
    }
    if (filters && filters.length > 1) {
      parsedFilters = filters.split(",")
    }

    ctx.body = await QuizAnswer.getPaginatedByQuizIdAndSearchQuery(
      quizId,
      size,
      order,
      parsedFilters,
      searchQuery,
    )
  })

  .get("/:quizId/manual-review", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedManualReview(
      quizId,
      page,
      size,
      order,
    )
  })

  .post("/:quizId/manual-review", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { size, order } = ctx.request.query
    const { searchQuery } = ctx.request.body
    ctx.body = await QuizAnswer.getPaginatedManualReviewBySearchQuery(
      quizId,
      size,
      order,
      searchQuery,
    )
  })

  .delete("/:answerId", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "delete")
    const quizAnswer = await QuizAnswer.query().findById(answerId)
    if (quizAnswer.deleted) {
      ctx.body = quizAnswer
    } else {
      ctx.body = await QuizAnswer.deleteAnswer(answerId)
    }
  })

export default answersRoutes

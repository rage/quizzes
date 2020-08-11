import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz, QuizAnswer, User } from "../../models/"
import accessControl, { validToken } from "../../middleware/access_control"
import {
  checkAccessOrThrow,
  getCourseIdByAnswerId,
  getCourseIdByQuizId,
} from "./util"

const admin = accessControl({ administator: true })

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})
  .post("/quizzes", accessControl(), async ctx => {
    await checkAccessOrThrow(ctx.state.user, ctx.request.body.courseId, "edit")
    const quizData = ctx.request.body
    ctx.body = await Quiz.saveQuiz(quizData)
  })
  .get("/quizzes/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const quiz = await Quiz.getById(quizId)
    await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
    ctx.body = quiz
  })
  .get("/courses/:courseId/quizzes", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Quiz.getByCourseId(courseId)
  })
  .get("/courses", accessControl(), async ctx => {
    await checkAccessOrThrow(ctx.state.user)
    ctx.body = await Course.getAll()
  })
  .get("/courses/:courseId", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Course.getFlattenedById(courseId)
  })
  .post("/answers/:answerId/status", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    const statusData = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatus(answerId, statusData)
  })
  .get("/answers/:answerId", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getById(answerId)
  })
  .get("/answers/:quizId/all", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedByQuizId(quizId, page, size)
  })
  .get("/answers/:quizId/manual-review", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedManualReview(quizId, page, size)
  })
  .post("/quizzes/:quizId/download-quiz-info", async ctx => {
    const quizId = ctx.params.quizId
    await checkAccessOrThrow(ctx.state.user)
    const token = ctx.request.body
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getQuizInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment("quiz-info.csv")
      ctx.body = stream
    }
  })
  .post("/quizzes/:quizId/download-peerreview-info", async ctx => {
    const quizId = ctx.params.quizId
    await checkAccessOrThrow(ctx.state.user)
    const token = ctx.request.body
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getPeerReviewInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment("quiz-peerreview-info.csv")
      ctx.body = stream
    }
  })
  .post("/quizzes/:quizId/download-answer-info", async ctx => {
    const quizId = ctx.params.quizId
    await checkAccessOrThrow(ctx.state.user)
    const token = ctx.request.body
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getQuizAnswerInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment("quiz-answer-info.csv")
      ctx.body = stream
    }
  })

export default dashboard

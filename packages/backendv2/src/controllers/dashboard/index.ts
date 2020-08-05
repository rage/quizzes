import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz, QuizAnswer } from "../../models/"
import accessControl, { validToken } from "../../middleware/access_control"

const admin = accessControl({ administator: true })

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})
  .post("/quizzes", admin, async ctx => {
    const quizData = ctx.request.body
    ctx.body = await Quiz.saveQuiz(quizData)
  })
  .get("/quizzes/:quizId", admin, async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.getById(quizId)
  })
  .get("/courses/:courseId/quizzes", admin, async ctx => {
    const courseId = ctx.params.courseId
    ctx.body = await Quiz.getByCourseId(courseId)
  })
  .get("/courses", admin, async ctx => {
    ctx.body = await Course.getAll()
  })
  .get("/courses/:courseId", admin, async ctx => {
    const courseId = ctx.params.courseId
    ctx.body = await Course.getFlattenedById(courseId)
  })
  .post("/courses/:courseId/duplicate-course", async ctx => {
    const oldCourseId = ctx.params.courseId
    const token = ctx.request.body.token
    const name = ctx.request.body.name
    const abbr = ctx.request.body.abbr
    const languageId = ctx.request.body.lang
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment("quiz-transition.csv")
      ctx.body = await Course.duplicateCourse(
        oldCourseId,
        name,
        abbr,
        languageId,
      )
    }
  })
  .post("/courses/download-correspondance-file", async ctx => {
    const token = ctx.request.body.token
    const oldCourseId = ctx.request.body.oldCourseId
    const courseId = ctx.request.body.courseId
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment("quiz-transition.csv")
      ctx.body = await Course.getCorrespondanceFile(oldCourseId, courseId)
    }
  })
  .post("/answers/:answerId/status", admin, async ctx => {
    const answerId = ctx.params.answerId
    const statusData = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatus(answerId, statusData)
  })
  .get("/answers/:answerId", admin, async ctx => {
    const answerId = ctx.params.answerId
    ctx.body = await QuizAnswer.getById(answerId)
  })
  .get("/answers/:quizId/all", admin, async ctx => {
    const quizId = ctx.params.quizId
    const { page, size } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedByQuizId(quizId, page, size)
  })
  .get("/answers/:quizId/manual-review", admin, async ctx => {
    const quizId = ctx.params.quizId
    const { page, size } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedManualReview(quizId, page, size)
  })
  .post("/quizzes/:quizId/download-quiz-info", async ctx => {
    const quizId = ctx.params.quizId
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

  .get("/languages/all", admin, async ctx => {
    ctx.body = await Course.getAllLanguages()
  })

export default dashboard

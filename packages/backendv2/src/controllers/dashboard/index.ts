import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz, QuizAnswer, User, UserCourseRole } from "../../models/"
import accessControl, { validToken } from "../../middleware/access_control"
import {
  abilitiesByRole,
  checkAccessOrThrow,
  getCourseIdByAnswerId,
  getCourseIdByQuizId,
  getAccessableCourses,
} from "./util"

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
    const user = ctx.state.user
    ctx.body = await getAccessableCourses(ctx.state.user, "view")
  })
  .get("/courses/:courseId", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Course.getFlattenedById(courseId)
  })
  .get(
    "/courses/:courseId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const courseId = ctx.params.courseId
      await checkAccessOrThrow(ctx.state.user, courseId, "view")
      ctx.body = await QuizAnswer.getManualReviewCountsByCourseId(courseId)
    },
  )
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
      ctx.response.attachment(`update_ids_from_${oldCourseId}`)
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
      ctx.response.set("Content-Type", "text/plain")
      ctx.response.attachment(`update_ids_from_${oldCourseId}_to_${courseId}`)
      ctx.body = await Course.getCorrespondanceFile(oldCourseId, courseId)
    }
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
    const token = ctx.request.body.token
    const quizName = ctx.request.body.quizName
    const courseName = ctx.request.body.courseName
    const current_datetime = new Date()
    const isoDate =
      current_datetime.getDate() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getFullYear() +
      "-" +
      current_datetime.getHours() +
      "-" +
      current_datetime.getMinutes()
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getQuizInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment(
        `quiz-info-${quizName}-${courseName}-${isoDate}.csv`,
      )
      ctx.body = stream
    }
  })
  .post("/quizzes/:quizId/download-peerreview-info", async ctx => {
    const quizId = ctx.params.quizId
    const token = ctx.request.body.token
    const quizName = ctx.request.body.quizName
    const courseName = ctx.request.body.courseName
    const current_datetime = new Date()
    const isoDate =
      current_datetime.getDate() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getFullYear() +
      "-" +
      current_datetime.getHours() +
      "-" +
      current_datetime.getMinutes()
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getPeerReviewInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment(
        `quiz-peerreview-info-${quizName}-${courseName}-${isoDate}.csv`,
      )
      ctx.body = stream
    }
  })
  .post("/quizzes/:quizId/download-answer-info", async ctx => {
    const quizId = ctx.params.quizId
    const token = ctx.request.body.token
    const quizName = ctx.request.body.quizName
    const courseName = ctx.request.body.courseName
    const current_datetime = new Date()
    const isoDate =
      current_datetime.getDate() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getFullYear() +
      "-" +
      current_datetime.getHours() +
      "-" +
      current_datetime.getMinutes()
    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      const stream = await Quiz.getQuizAnswerInfo(quizId)
      ctx.response.set("Content-Type", "text/csv")
      ctx.response.attachment(
        `quiz-answer-info-${quizName}-${courseName}-${isoDate}.csv`,
      )
      ctx.body = stream
    }
  })
  .get("/languages/all", accessControl(), async ctx => {
    ctx.body = await Course.getAllLanguages()
  })
  .get("/users/current/abilities", accessControl(), async ctx => {
    const courseRoles = await UserCourseRole.getByUserId(ctx.state.user.id)
    ctx.body = courseRoles.map(courseRole => {
      const abilitiesByCourse: { [courseId: string]: string[] } = {}
      abilitiesByCourse[courseRole.courseId] = abilitiesByRole[courseRole.role]
      return abilitiesByCourse
    })
  })

export default dashboard

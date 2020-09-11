import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import {
  Course,
  Quiz,
  QuizAnswer,
  User,
  UserCourseRole,
  PeerReviewQuestion,
  CourseTranslation,
} from "../../models/"
import accessControl, { validToken } from "../../middleware/access_control"
import {
  abilitiesByRole,
  checkAccessOrThrow,
  getCourseIdByAnswerId,
  getCourseIdByQuizId,
  getAccessableCourses,
} from "./util"
import * as Kafka from "../../services/kafka"

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
  .get(
    "/quizzes/:quizId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const quizId = ctx.params.quizId
      const quiz = await Quiz.getById(quizId)
      await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
      ctx.body = await QuizAnswer.getManualReviewCountByQuizId(quizId)
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
    const status = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatus(answerId, status)
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
  .get("/answers/:quizId/manual-review", accessControl(), async ctx => {
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
    const abilitiesByCourse: { [courseId: string]: string[] } = {}
    for (const courseRole of courseRoles) {
      abilitiesByCourse[courseRole.courseId] = abilitiesByRole[courseRole.role]
    }
    ctx.body = abilitiesByCourse
  })
  .get("/users/:userId/broadcast/:courseId", accessControl(), async ctx => {
    const { userId, courseId } = ctx.params
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    await Kafka.broadcastUserCourse(userId, courseId)
  })
  .get("/courses/:courseId/user/abilities", accessControl(), async ctx => {
    const courseRole = (
      await UserCourseRole.getByUserIdAndCourseId(
        ctx.state.user.id,
        ctx.params.courseId,
      )
    ).map(role => role.role)
    if (ctx.state.user.administrator) {
      courseRole.push("admin")
    }
    const allAbilities = [
      ...new Set(courseRole.map(role => abilitiesByRole[role]).flat()),
    ]
    ctx.body = allAbilities
  })
  .get("/quizzes/:quizId/answerStatistics", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getAnswerCountsByStatus(quizId)
  })
  .get("/quizzes/answers/get-answer-states", accessControl(), async ctx => {
    const result = await QuizAnswer.getStates()
    ctx.body = result
  })
  .post("/courses/:courseId/modify-course-title", async ctx => {
    const courseId = ctx.params.courseId
    const newTitle = ctx.request.body.title
    const token = ctx.request.body.token

    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      ctx.body = await CourseTranslation.updateCourseTitle(courseId, newTitle)
    }
  })
  .post("/courses/:courseId/modify-course-abbreviation", async ctx => {
    const courseId = ctx.params.courseId
    const newAbbreviation = ctx.request.body.abbreviation
    const token = ctx.request.body.token

    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      ctx.body = await CourseTranslation.updateCourseAbbreviation(
        courseId,
        newAbbreviation,
      )
    }
  })
  .post("/courses/:courseId/modify-moocId", async ctx => {
    const courseId = ctx.params.courseId
    const newMoocId = ctx.request.body.moocfiId
    const token = ctx.request.body.token

    if (!validToken(token)) {
      ctx.body = "invalid token"
    } else {
      ctx.body = await Course.updateMoocfiId(courseId, newMoocId)
    }
  })

export default dashboard

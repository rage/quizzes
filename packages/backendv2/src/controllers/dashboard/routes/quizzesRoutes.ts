import Router from "koa-router"
import accessControl from "../../../middleware/access_control"
import { Course, Quiz, QuizAnswer } from "../../../models"
import { CustomContext, CustomState } from "../../../types"
import { checkAccessOrThrow, getCourseIdByQuizId } from "../util"

const quizzesRoutes = new Router<CustomState, CustomContext>({
  prefix: "/quizzes",
})
  .post("/", accessControl(), async ctx => {
    await checkAccessOrThrow(ctx.state.user, ctx.request.body.courseId, "edit")
    const quizData = ctx.request.body
    ctx.body = await Quiz.save(quizData)
  })

  .get("/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const quiz = await Quiz.getById(quizId)
    await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
    ctx.body = quiz
  })

  .get(
    "/:quizId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const quizId = ctx.params.quizId
      const quiz = await Quiz.getById(quizId)
      await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
      const requiringAttention = await QuizAnswer.getManualReviewCountByQuizId(
        quizId,
      )
      ctx.body = requiringAttention
    },
  )

  .post("/:quizId/download-quiz-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
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

    const course = await Course.getByTitle(courseName)

    await checkAccessOrThrow(ctx.state.user, course.id, "download")

    const stream = await Quiz.getQuizInfo(quizId)
    ctx.response.set("Content-Type", "text/csv")
    ctx.response.attachment(
      `quiz-info-${quizName}-${courseName}-${isoDate}.csv`,
    )
    ctx.body = stream
  })

  .post("/:quizId/download-peerreview-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
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

    const course = await Course.getByTitle(courseName)

    await checkAccessOrThrow(ctx.state.user, course.id, "download")

    const stream = await Quiz.getPeerReviewInfo(quizId)
    ctx.response.set("Content-Type", "text/csv")
    ctx.response.attachment(
      `quiz-peerreview-info-${quizName}-${courseName}-${isoDate}.csv`,
    )
    ctx.body = stream
  })

  .post("/:quizId/download-answer-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
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

    const course = await Course.getByTitle(courseName)

    await checkAccessOrThrow(ctx.state.user, course.id, "download")

    const stream = await Quiz.getQuizAnswerInfo(quizId)
    ctx.response.set("Content-Type", "text/csv")
    ctx.response.attachment(
      `quiz-answer-info-${quizName}-${courseName}-${isoDate}.csv`,
    )
    ctx.body = stream
  })

  .get("/:quizId/answerStatistics", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getAnswerCountsByStatus(quizId)
  })

  .get("/answers/get-answer-states", accessControl(), async ctx => {
    ctx.body = await QuizAnswer.getStates()
  })

export default quizzesRoutes

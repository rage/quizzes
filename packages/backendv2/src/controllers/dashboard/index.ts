import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz, QuizAnswer } from "../../models/"
import accessControl from "../../middleware/access_control"

const admin = accessControl({ administator: true })

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})
  .post("/quizzes", admin, async ctx => {
    ctx.body = await Quiz.saveQuiz(ctx.request.body)
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
  .get("/answers/:answerId", admin, async ctx => {
    const answerId = ctx.params.answerId
    ctx.body = await QuizAnswer.getById(answerId)
  })
  .get("/answers/manual-review/:quizId", admin, async ctx => {
    const quizId = ctx.params.quizId
    const { page, size } = ctx.request.query
    ctx.body = await QuizAnswer.getAnswersForManualReview(quizId, page, size)
  })

export default dashboard

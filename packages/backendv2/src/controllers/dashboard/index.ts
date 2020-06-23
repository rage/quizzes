import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz } from "../../models/"
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

export default dashboard

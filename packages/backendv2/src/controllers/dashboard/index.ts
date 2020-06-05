import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Course, Quiz } from "../../models/"
import accessControl from "../../middleware/access_control"

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})
  .get("/quizzes/:quizId", accessControl({ administator: true }), async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.getQuizById(quizId)
  })
  .get("/courses", accessControl({ administator: true }), async ctx => {
    ctx.body = await Course.getAll()
  })

export default dashboard

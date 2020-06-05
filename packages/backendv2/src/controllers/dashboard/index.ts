import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Quiz } from "../../models/"
import accessControl from "../../middleware/access_control"

const admin = accessControl({ administator: true })

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})
  .post("/quizzes", admin, async ctx => {
    const data = ctx.request.body
    console.log(data)
    const quiz = await Quiz.query().upsertGraphAndFetch(data)
    ctx.body = quiz
  })
  .get("/quizzes/:quizId", admin, async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.getQuizById(quizId)
  })

export default dashboard

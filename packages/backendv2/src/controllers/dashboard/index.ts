import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { Quiz } from "../../models/"
import accessControl from "../../middleware/access_control"

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
}).get("/:quizId", accessControl({ administator: true }), async ctx => {
  const quizId = ctx.params.quizId
  ctx.body = await Quiz.getQuizById(quizId)
})

export default dashboard

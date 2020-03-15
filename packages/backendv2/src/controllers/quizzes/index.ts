import Router from "koa-router"
import Quiz from "../../models/quiz"
import accessControl from "../../middleware/access_control"

const quizzes = new Router({
  prefix: "/quizzes",
})

quizzes.get("/:quizId", accessControl(), async ctx => {
  const quizId = ctx.params.quizId
  console.log(ctx.state.user)
  ctx.body = await Quiz.query()
    .withGraphJoined("items.[options]")
    .where("quiz.id", quizId)
})

quizzes.get(
  "/:quizId/preview",
  accessControl({ unrestricted: true }),
  async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.query()
      .withGraphJoined("items.[options]")
      .where("quiz.id", quizId)
  },
)

export default quizzes

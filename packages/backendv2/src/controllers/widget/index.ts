import Router from "koa-router"
import Quiz from "../../models/quiz"
import QuizAnswer from "../../models/quiz_answer"
import accessControl from "../../middleware/access_control"

const widget = new Router({
  prefix: "/widget",
})

  .get("/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.query()
      .withGraphJoined("items.[options]")
      .where("quiz.id", quizId)
  })

  .get("/:quizId/preview", accessControl({ unrestricted: true }), async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.query()
      .withGraphJoined("items.[options]")
      .where("quiz.id", quizId)
  })

  .post("/answer", accessControl(), async ctx => {
    console.log(ctx.req)
    ctx.body = "answer"
  })

export default widget

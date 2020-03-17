import Router from "koa-router"
import Quiz from "../../models/quiz"
import QuizAnswer from "../../models/quiz_answer"
import QuizItemAnswer from "../../models/quiz_item_answer"
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
    const user = ctx.state.user
    console.log("herp")
    const answer = ctx.request.body
    answer.user = { id: user.id }
    try {
      const response = await QuizAnswer.query().insertGraph(answer)
      ctx.body = response
    } catch (error) {
      error.status = 500
      throw error
    }
  })

export default widget

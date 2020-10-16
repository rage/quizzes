import Router from "koa-router"
import knex from "../../../database/knex"
import { CustomContext, CustomState } from "../../types"
import { Quiz, QuizAnswer, User } from "../../models/"
import accessControl from "../../middleware/access_control"
import SpamFlag from "../../models/spam_flag"

const widget = new Router<CustomState, CustomContext>({
  prefix: "/widget",
})

  .get("/quizzes/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.getById(quizId)
  })

  .get(
    "/quizzes/:quizId/preview",
    accessControl({ unrestricted: true }),
    async ctx => {
      const quizId = ctx.params.quizId
      ctx.body = await Quiz.getPreviewById(quizId)
    },
  )

  .post("/answer", accessControl(), async ctx => {
    const user = ctx.state.user
    const answer = ctx.request.body
    ctx.body = await QuizAnswer.newAnswer(user.id, QuizAnswer.fromJson(answer))
  })

  .post("/answers/:answerId/report-spam", accessControl(), async ctx => {
    console.log("hep")
    const quizAnswerId = ctx.params.answerId
    const userId = ctx.request.body.userId
    ctx.body = await SpamFlag.reportSpam(quizAnswerId, userId)
  })

export default widget

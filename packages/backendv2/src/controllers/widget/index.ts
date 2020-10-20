import Router from "koa-router"
import knex from "../../../database/knex"
import { CustomContext, CustomState } from "../../types"
import { Quiz, QuizAnswer, User, PeerReview } from "../../models/"
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

  .get("/answers/:answerId/peer-reviews", accessControl(), async ctx => {
    const answerId = ctx.params.answerId

    // check that answerId exists
    try {
      await QuizAnswer.getById(answerId)
    } catch (error) {
      throw error
    }

    const peerReviews = await PeerReview.getWithAnswersByAnswerId(answerId)

    const receivedPeerReviews = peerReviews.map((pr: any) => ({
      id: pr.id,
      peerReviewCollectionId: pr.peerReviewCollectionId,
      createdAt: pr.createdAt,
      answers: pr.answers.map((prAnswer: any) => {
        const { createdAt, updatedAt, ...rest } = prAnswer
        return rest
      }),
    }))

    ctx.body = receivedPeerReviews
  })

  .post("/answer", accessControl(), async ctx => {
    const user = ctx.state.user
    const answer = ctx.request.body
    ctx.body = await QuizAnswer.newAnswer(user.id, QuizAnswer.fromJson(answer))
  })

  .post("/answers/report-spam", accessControl(), async ctx => {
    const quizAnswerId = ctx.request.body.quizAnswerId
    const userId = ctx.state.user.id
    ctx.body = await SpamFlag.reportSpam(quizAnswerId, userId)
  })

export default widget

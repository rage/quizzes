import Router from "@koa/router"

import knex from "../../../database/knex"
import accessControl from "../../middleware/access_control"
import {
  Quiz,
  QuizAnswer,
  PeerReview,
  UserQuizState,
  Course,
  SpamFlag,
} from "../../models/"
import { CustomContext, CustomState } from "../../types"
import { checkAccessOrThrow, getCourseIdByQuizId } from "./../dashboard/util"

const widget = new Router<CustomState, CustomContext>({
  prefix: "/widget",
})

  .get("/quizzes/:quizId", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const userId = ctx.state.user.id
    const userQuizState = await UserQuizState.getByUserAndQuiz(userId, quizId)
    let quizAnswer: QuizAnswer | null = await QuizAnswer.getByUserAndQuiz(
      userId,
      quizId,
    )
    if (quizAnswer?.deleted) {
      quizAnswer = null
    }
    const quiz = await Quiz.getById(quizId)
    Quiz.hideAnswerKeyFrom(quiz, userQuizState)
    const course = await Course.getById(quiz.courseId)
    quiz.course = course
    ctx.body = {
      quiz,
      quizAnswer,
      userQuizState,
    }
  })

  .get(
    "/quizzes/:quizId/preview",
    accessControl({ unrestricted: true }),
    async (ctx) => {
      const quizId = ctx.params.quizId
      ctx.body = await Quiz.getPreviewById(quizId)
    },
  )

  .get("/answers/:answerId/peer-reviews", accessControl(), async (ctx) => {
    const answerId = ctx.params.answerId
    const answer = await QuizAnswer.getOwnerAndQuiz(answerId)
    if (answer.userId !== ctx.state.user.id) {
      await checkAccessOrThrow(
        ctx.state.user,
        await getCourseIdByQuizId(answer.quizId),
        "view",
      )
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

  .post("/answer", accessControl(), async (ctx) => {
    const user = ctx.state.user
    ctx.body = await QuizAnswer.newAnswer(
      user.id,
      QuizAnswer.fromSubmission(ctx.request.body),
    )
  })

  .post("/answers/report-spam", accessControl(), async (ctx) => {
    const { quizAnswerId } = ctx.request.body as { quizAnswerId: string }
    const userId = ctx.state.user.id
    ctx.body = await SpamFlag.reportSpam(quizAnswerId, userId)
  })

  .get("/answers/:quizId/get-candidates", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const userId = ctx.state.user.id
    ctx.body = await QuizAnswer.getAnswersToReview(userId, quizId)
  })

  .post("/answers/give-review", accessControl(), async (ctx) => {
    const userId = ctx.state.user.id
    ctx.body = await PeerReview.givePeerReview(
      PeerReview.fromSubmission(ctx.request.body, userId),
    )
  })

  .post(
    "/answers/give-review/only-admins",
    accessControl({ administrator: true }),
    async (ctx) => {
      const userId = ctx.state.user.id
      ctx.body = await PeerReview.givePeerReview(
        PeerReview.fromSubmission(ctx.request.body, userId),
        true,
      )
    },
  )

export default widget

import { checkAccessOrThrow } from "./../dashboard/util"
import Router from "koa-router"
import knex from "../../../database/knex"
import { CustomContext, CustomState } from "../../types"
import {
  Quiz,
  QuizAnswer,
  PeerReview,
  UserQuizState,
  Course,
  SpamFlag,
} from "../../models/"
import accessControl from "../../middleware/access_control"

const widget = new Router<CustomState, CustomContext>({
  prefix: "/widget",
})

  .get("/quizzes/:quizId", accessControl(), async ctx => {
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
    let canSeeAnswers = false
    const strippedQuiz = await Quiz.getByIdStripped(quizId)
    if (
      userQuizState?.status === "locked" ||
      (userQuizState?.pointsAwarded || 0) >= strippedQuiz.points
    ) {
      canSeeAnswers = true
    }
    const quiz = canSeeAnswers ? await Quiz.getById(quizId) : strippedQuiz
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
    async ctx => {
      const quizId = ctx.params.quizId
      ctx.body = await Quiz.getPreviewById(quizId)
    },
  )

  .get("/answers/:answerId/peer-reviews", accessControl(), async ctx => {
    const answerId = ctx.params.answerId

    // check that answerId exists
    try {
      await QuizAnswer.getByIdWithPeerReviews(answerId)
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

  .get("/answers/:quizId/get-candidates", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const userId = ctx.state.user.id
    ctx.body = await QuizAnswer.getAnswersToReview(userId, quizId)
  })

  .post("/answers/give-review", accessControl(), async ctx => {
    const userId = ctx.state.user.id
    const peerReview = ctx.request.body
    peerReview.userId = userId
    ctx.body = await PeerReview.givePeerReview(peerReview)
  })

export default widget

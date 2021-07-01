import Router from "koa-router"
import redis from "../../../../config/redis"
import accessControl from "../../../middleware/access_control"
import { Quiz, QuizAnswer } from "../../../models"
import { CustomContext, CustomState } from "../../../types"
import { BadRequestError } from "../../../util/error"
import { getFormattedIsoDate } from "../../../util/tools"
import {
  checkAccessOrThrow,
  getCourseIdByQuizId,
  getDownloadTokenFromRedis,
} from "../util"

const quizzesRoutes = new Router<CustomState, CustomContext>({
  prefix: "/quizzes",
})
  .post("/", accessControl(), async ctx => {
    await checkAccessOrThrow(ctx.state.user, ctx.request.body.courseId, "edit")
    const quizData = ctx.request.body
    ctx.body = await Quiz.save(quizData)
  })

  .get("/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const quiz = await Quiz.getById(quizId)
    await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
    ctx.body = quiz
  })

  .get(
    "/:quizId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const quizId = ctx.params.quizId
      const quiz = await Quiz.getById(quizId)
      await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
      const requiringAttention = await QuizAnswer.getManualReviewCountByQuizId(
        quizId,
      )
      ctx.body = requiringAttention
    },
  )

  .get(
    "/:quizId/count-answers-flagged-as-plagiarism",
    accessControl(),
    async ctx => {
      const quizId = ctx.params.quizId
      const quiz = await Quiz.getById(quizId)
      await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
      const flaggedAsPlagiarism = await QuizAnswer.getFlaggedAsPlagiarismCountByQuizId(
        quizId,
      )
      ctx.body = flaggedAsPlagiarism
    },
  )

  .post("/:quizId/download-quiz-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const { courseId } = ctx.request.body

    if (!ctx.state.user.id) {
      throw new BadRequestError("No user id provided.")
    }

    const userId = ctx.state.user.id.toString() as string

    // check permissions
    await checkAccessOrThrow(ctx.state.user, courseId, "download")

    // attempt retrieval of download token from cache
    const downloadToken = await getDownloadTokenFromRedis(userId)

    if (downloadToken) {
      ctx.body = {
        downloadUrl: `/api/v2/dashboard/quizzes/download/download-quiz-info/${quizId}?&downloadToken=${downloadToken}`,
      }
    } else {
      throw new BadRequestError("Failed to generate download token.")
    }
  })

  .post("/download/download-quiz-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = await redis.client.get(userId)

      if (cachedToken === downloadToken) {
        const stream = await Quiz.getQuizInfo(quizId)
        ctx.response.set("Content-Type", "text/csv")
        ctx.response.attachment(
          `quiz-info-${quizName}-${courseName}-${isoDate}.csv`,
        )
        ctx.body = stream
      } else {
        throw new BadRequestError("Download token does not match cached token.")
      }
    }
  })

  .post("/:quizId/download-peerreview-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const { courseId } = ctx.request.body

    if (!ctx.state.user.id) {
      throw new BadRequestError("No user id provided.")
    }

    const userId = ctx.state.user.id.toString()

    // check permissions
    await checkAccessOrThrow(ctx.state.user, courseId, "download")

    // attempt retrieval of download token from cache
    const downloadToken = await getDownloadTokenFromRedis(userId)

    if (downloadToken) {
      // since permission checked and token ready, return download url & token
      ctx.body = {
        downloadUrl: `/api/v2/dashboard/quizzes/download/download-peerreview-info/${quizId}?&downloadToken=${downloadToken}`,
      }
    } else {
      throw new BadRequestError("Failed to generate download token.")
    }
  })

  .post("/download/download-peerreview-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken.toString()
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = await redis.client.get(userId)

      if (cachedToken === downloadToken) {
        const stream = await Quiz.getPeerReviewInfo(quizId)
        ctx.response.set("Content-Type", "text/csv")
        ctx.response.attachment(
          `quiz-peer_review-info-${quizName}-${courseName}-${isoDate}.csv`,
        )
        ctx.body = stream
      } else {
        throw new BadRequestError("Download token does not match cached token.")
      }
    }
  })

  .post("/:quizId/download-answer-info", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const { courseId } = ctx.request.body

    if (!ctx.state.user.id) {
      throw new BadRequestError("No user id provided.")
    }

    const userId = ctx.state.user.id.toString()

    // check permissions
    await checkAccessOrThrow(ctx.state.user, courseId, "download")

    // attempt retrieval of download token from cache
    const downloadToken = await getDownloadTokenFromRedis(userId)

    if (downloadToken) {
      // since permission checked and token ready, return download url & token
      ctx.body = {
        downloadUrl: `/api/v2/dashboard/quizzes/download/download-answer-info/${quizId}?&downloadToken=${downloadToken}`,
      }
    } else {
      throw new BadRequestError("Failed to generate download token.")
    }
  })

  .post("/download/download-answer-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken.toString()
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = await redis.client.get(userId)
      if (cachedToken === downloadToken) {
        const stream = await Quiz.getQuizAnswerInfo(quizId)
        ctx.response.set("Content-Type", "text/csv")
        ctx.response.attachment(
          `quiz-answer-info-${quizName}-${courseName}-${isoDate}.csv`,
        )
        ctx.body = stream
      } else {
        throw new BadRequestError("Download token does not match cached token.")
      }
    }
  })

  .get("/:quizId/answerStatistics", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getAnswerCountsByStatus(quizId)
  })

  .get("/answers/get-answer-states", accessControl(), async ctx => {
    ctx.body = await QuizAnswer.getStates()
  })

export default quizzesRoutes

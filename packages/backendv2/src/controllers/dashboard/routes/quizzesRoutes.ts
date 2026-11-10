import { Readable } from "stream"

import Router, { RouterMiddleware } from "@koa/router"

import accessControl from "../../../middleware/access_control"
import { Quiz, QuizAnswer } from "../../../models"
import { CustomContext, CustomState } from "../../../types"
import { BadRequestError } from "../../../util/error"
import { getFormattedIsoDate } from "../../../util/tools"
import {
  checkAccessOrThrow,
  consumeDownloadToken,
  createDownloadToken,
  DownloadKind,
  getCourseIdByQuizId,
} from "../util"

interface DownloadRequestBody {
  quizName: string
  courseName: string
}

const downloads: Record<
  DownloadKind,
  { filePrefix: string; stream: (quizId: string) => Promise<Readable> }
> = {
  "quiz-info": {
    filePrefix: "quiz-info",
    stream: (quizId) => Quiz.getQuizInfo(quizId),
  },
  "peerreview-info": {
    filePrefix: "quiz-peer_review-info",
    stream: (quizId) => Quiz.getPeerReviewInfo(quizId),
  },
  "answer-info": {
    filePrefix: "quiz-answer-info",
    stream: (quizId) => Quiz.getQuizAnswerInfo(quizId),
  },
}

const issueDownloadUrl =
  (kind: DownloadKind): RouterMiddleware<CustomState, CustomContext> =>
  async (ctx) => {
    const quizId = ctx.params.quizId

    if (!ctx.state.user.id) {
      throw new BadRequestError("No user id provided.")
    }

    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "download")

    const downloadToken = await createDownloadToken(quizId, kind)
    if (!downloadToken) {
      throw new BadRequestError("Failed to generate download token.")
    }
    ctx.body = {
      downloadUrl: `/api/v2/dashboard/quizzes/download/download-${kind}/${quizId}?&downloadToken=${downloadToken}`,
    }
  }

// Unauthenticated: reached by a browser form post, so the token is the only credential.
const serveDownload =
  (kind: DownloadKind): RouterMiddleware<CustomState, CustomContext> =>
  async (ctx) => {
    const downloadToken = ctx.query.downloadToken?.toString()
    const quizId = ctx.params.quizId
    const { quizName, courseName } = ctx.request.body as DownloadRequestBody

    if (!downloadToken) {
      throw new BadRequestError("No download token provided.")
    }

    let isValid: boolean
    try {
      isValid = await consumeDownloadToken(downloadToken, quizId, kind)
    } catch (error) {
      throw new BadRequestError("Failed to validate download token.")
    }
    if (!isValid) {
      throw new BadRequestError("Invalid or expired download token.")
    }

    const { filePrefix, stream } = downloads[kind]
    ctx.response.set("Content-Type", "text/csv; charset=utf-8")
    ctx.response.attachment(
      `${filePrefix}-${quizName}-${courseName}-${getFormattedIsoDate()}.csv`,
    )
    ctx.body = await stream(quizId)
  }

const quizzesRoutes = new Router<CustomState, CustomContext>({
  prefix: "/quizzes",
})
  .post("/", accessControl(), async (ctx) => {
    const quizData = ctx.request.body as { id?: string; courseId: string }
    await checkAccessOrThrow(ctx.state.user, quizData.courseId, "edit")
    ctx.body = await Quiz.save(quizData)
  })

  .get("/:quizId", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const quiz = await Quiz.getById(quizId)
    await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
    ctx.body = quiz
  })

  .get(
    "/:quizId/count-answers-requiring-attention",
    accessControl(),
    async (ctx) => {
      const quizId = ctx.params.quizId
      const quiz = await Quiz.getById(quizId)
      await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
      const requiringAttention =
        await QuizAnswer.getManualReviewCountByQuizId(quizId)
      ctx.body = requiringAttention
    },
  )

  .post(
    "/:quizId/download-quiz-info",
    accessControl(),
    issueDownloadUrl("quiz-info"),
  )
  .post("/download/download-quiz-info/:quizId", serveDownload("quiz-info"))

  .post(
    "/:quizId/download-peerreview-info",
    accessControl(),
    issueDownloadUrl("peerreview-info"),
  )
  .post(
    "/download/download-peerreview-info/:quizId",
    serveDownload("peerreview-info"),
  )

  .post(
    "/:quizId/download-answer-info",
    accessControl(),
    issueDownloadUrl("answer-info"),
  )
  .post("/download/download-answer-info/:quizId", serveDownload("answer-info"))

  .get("/:quizId/answerStatistics", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getAnswerCountsByStatus(quizId)
  })

  .get("/answers/get-answer-states", accessControl(), async (ctx) => {
    ctx.body = await QuizAnswer.getStates()
  })

export default quizzesRoutes

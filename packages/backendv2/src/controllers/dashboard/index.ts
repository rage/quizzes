import { getFormattedIsoDate } from "./../../util/tools"
import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import {
  Course,
  Quiz,
  QuizAnswer,
  UserCourseRole,
  CourseTranslation,
  Language,
} from "../../models/"
import accessControl from "../../middleware/access_control"
import {
  abilitiesByRole,
  checkAccessOrThrow,
  getCourseIdByAnswerId,
  getCourseIdByQuizId,
  getAccessibleCourses,
  getDownloadTokenFromRedis,
} from "./util"
import * as Kafka from "../../services/kafka"
import _ from "lodash"
import UserCoursePartState from "../../models/user_course_part_state"
import knex from "../../../database/knex"
import { BadRequestError } from "../../util/error"
import redis from "../../../config/redis"

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})

  .post("/quizzes", accessControl(), async ctx => {
    await checkAccessOrThrow(ctx.state.user, ctx.request.body.courseId, "edit")
    const quizData = ctx.request.body
    ctx.body = await Quiz.save(quizData)
  })

  .get("/quizzes/:quizId", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const quiz = await Quiz.getById(quizId)
    await checkAccessOrThrow(ctx.state.user, quiz.courseId, "view")
    ctx.body = quiz
  })

  .get("/courses/:courseId/quizzes", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Quiz.getByCourseId(courseId)
  })

  .get("/courses", accessControl(), async ctx => {
    const user = ctx.state.user
    ctx.body = await getAccessibleCourses(user, "view")
  })

  .get("/courses/:courseId", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Course.getFlattenedById(courseId)
  })

  .get(
    "/courses/:courseId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const courseId = ctx.params.courseId
      await checkAccessOrThrow(ctx.state.user, courseId, "view")
      ctx.body = await QuizAnswer.getManualReviewCountsByCourseId(courseId)
    },
  )

  .get(
    "/quizzes/:quizId/count-answers-requiring-attention",
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

  .post("/courses/:courseId/duplicate-course", accessControl(), async ctx => {
    const oldCourseId = ctx.params.courseId
    const name = ctx.request.body.name
    const abbr = ctx.request.body.abbr
    const languageId = ctx.request.body.lang
    await checkAccessOrThrow(ctx.state.user, oldCourseId, "duplicate")
    ctx.body = await Course.duplicateCourse(oldCourseId, name, abbr, languageId)
  })

  .post("/courses/download-correspondence-file", accessControl(), async ctx => {
    const oldCourseId = ctx.request.body.oldCourseId
    const courseId = ctx.request.body.newCourseId
    ctx.response.set("Content-Type", "text/csv")
    ctx.response.attachment(`update_ids_from_${oldCourseId}_to_${courseId}.csv`)
    await checkAccessOrThrow(ctx.state.user, oldCourseId, "download")
    const stream = await Course.getCorrespondenceFile(oldCourseId, courseId)
    ctx.body = stream
  })

  .get(
    "/courses/:courseId/user/current/progress",
    accessControl(),
    async ctx => {
      const courseId = ctx.params.courseId
      const user = ctx.state.user
      try {
        ctx.body = await knex.transaction(
          async trx =>
            await UserCoursePartState.getProgress(user.id, courseId, trx),
        )
      } catch (err) {
        throw err
      }
    },
  )

  .post("/answers/:answerId/status", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    const status = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatus(answerId, status)
  })

  .post("/answers/status", accessControl(), async ctx => {
    const answerIds = ctx.request.body.answerIds

    if (!answerIds || !answerIds[0]) {
      throw new BadRequestError("No answer ids provided.")
    }
    let courseId
    try {
      courseId = await getCourseIdByAnswerId(answerIds[0])
    } catch (error) {
      throw error
    }

    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    const status = ctx.request.body.status
    ctx.body = await QuizAnswer.setManualReviewStatusForMany(answerIds, status)
  })

  .get("/answers/:answerId", accessControl(), async ctx => {
    const answerId = ctx.params.answerId
    const courseId = await getCourseIdByAnswerId(answerId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getByIdWithPeerReviews(answerId)
  })

  .get("/answers/:quizId/all", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order, filters } = ctx.request.query
    let parsedFilters = []
    if (filters && filters.length === 1) {
      parsedFilters = filters
    }
    if (filters && filters.length > 1) {
      parsedFilters = filters.split(",")
    }

    ctx.body = await QuizAnswer.getPaginatedByQuizId(
      quizId,
      page,
      size,
      order,
      parsedFilters,
    )
  })

  .post("/answers/:quizId/all", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)

    await checkAccessOrThrow(ctx.state.user, courseId, "view")

    const { size, order, filters } = ctx.request.query

    const { searchQuery } = ctx.request.body

    let parsedFilters = []
    if (filters && filters.length === 1) {
      parsedFilters = filters
    }
    if (filters && filters.length > 1) {
      parsedFilters = filters.split(",")
    }

    ctx.body = await QuizAnswer.getPaginatedByQuizIdAndSearchQuery(
      quizId,
      size,
      order,
      parsedFilters,
      searchQuery,
    )
  })

  .get("/answers/:quizId/manual-review", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { page, size, order } = ctx.request.query
    ctx.body = await QuizAnswer.getPaginatedManualReview(
      quizId,
      page,
      size,
      order,
    )
  })

  .post("/answers/:quizId/manual-review", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    const { size, order } = ctx.request.query
    const { searchQuery } = ctx.request.body
    ctx.body = await QuizAnswer.getPaginatedManualReviewBySearchQuery(
      quizId,
      size,
      order,
      searchQuery,
    )
  })

  .post("/quizzes/:quizId/download-quiz-info", accessControl(), async ctx => {
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
    console.log("💩 ~ file: index.ts ~ line 246 ~ downloadToken", downloadToken)

    if (downloadToken) {
      ctx.body = {
        downloadUrl: `/api/v2/dashboard/quizzes/download/download-quiz-info/${quizId}?&downloadToken=${downloadToken}`,
      }
    } else {
      throw new BadRequestError("Failed to generate download token.")
    }
  })

  .post("/quizzes/download/download-quiz-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = JSON.stringify(
        JSON.parse((await redis.client.get(userId)) as string),
      )

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

  .post(
    "/quizzes/:quizId/download-peerreview-info",
    accessControl(),
    async ctx => {
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
    },
  )

  .post("/quizzes/download/download-peerreview-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken.toString()
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = JSON.stringify(
        JSON.parse((await redis.client.get(userId)) as string),
      )

      if (cachedToken === downloadToken) {
        const stream = await Quiz.getQuizInfo(quizId)
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

  .post("/quizzes/:quizId/download-answer-info", accessControl(), async ctx => {
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

  .post("/quizzes/download/download-answer-info/:quizId", async ctx => {
    const downloadToken = ctx.query.downloadToken.toString()
    const { quizId } = ctx.params
    const isoDate = getFormattedIsoDate()

    const { quizName, courseName } = ctx.request.body
    const userId = ctx.request.body.userId.toString()

    // validate token
    if (downloadToken && redis.client) {
      const cachedToken = JSON.stringify(
        JSON.parse((await redis.client.get(userId)) as string),
      )
      if (cachedToken === downloadToken) {
        const stream = await Quiz.getQuizInfo(quizId)
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

  .get("/languages/all", accessControl(), async ctx => {
    ctx.body = await Language.getAll()
  })

  .get("/users/current/abilities", accessControl(), async ctx => {
    const courseRoles = await UserCourseRole.getByUserId(ctx.state.user.id)
    const abilitiesByCourse: { [courseId: string]: string[] } = {}
    for (const courseRole of courseRoles) {
      abilitiesByCourse[courseRole.courseId] = abilitiesByRole[courseRole.role]
    }
    ctx.body = abilitiesByCourse
  })

  .get("/users/:userId/broadcast/:courseId", accessControl(), async ctx => {
    const { userId, courseId } = ctx.params
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    await Kafka.broadcastUserCourse(userId, courseId)
  })

  .get("/courses/:courseId/user/abilities", accessControl(), async ctx => {
    const courseRole = (
      await UserCourseRole.getByUserIdAndCourseId(
        ctx.state.user.id,
        ctx.params.courseId,
      )
    ).map(role => role.role)
    if (ctx.state.user.administrator) {
      courseRole.push("admin")
    }
    const allAbilities = [
      ...new Set(courseRole.map(role => abilitiesByRole[role]).flat()),
    ]
    ctx.body = allAbilities
  })

  .get("/quizzes/:quizId/answerStatistics", accessControl(), async ctx => {
    const quizId = ctx.params.quizId
    const courseId = await getCourseIdByQuizId(quizId)
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await QuizAnswer.getAnswerCountsByStatus(quizId)
  })

  .get("/quizzes/answers/get-answer-states", accessControl(), async ctx => {
    ctx.body = await QuizAnswer.getStates()
  })

  .post("/courses/:courseId/edit", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    const payload = ctx.request.body
    const moocfiId = payload.moocfiId
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")

    // TODO: prbably good idea to check if moocfi id is a valid one (exists in DB)

    try {
      await Course.getFlattenedById(courseId)
    } catch (error) {
      throw error
    }

    if (!moocfiId && !payload) {
      throw new BadRequestError("No edited properties provided.")
    }

    const payloadWithoutMoocfiId = _.omit(payload, ["moocfiId"])

    await CourseTranslation.updateCourseProperties(
      courseId,
      payloadWithoutMoocfiId,
    )

    // moocfi id separated from rest since it is a property of Course entity
    if (moocfiId) {
      try {
        await Course.updateMoocfiId(courseId, moocfiId)
      } catch (error) {
        throw error
      }
    }

    ctx.body = await Course.getFlattenedById(courseId)
  })

export default dashboard

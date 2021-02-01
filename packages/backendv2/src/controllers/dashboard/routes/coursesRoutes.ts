import Router from "koa-router"
import _ from "lodash"
import knex from "../../../../database/knex"
import accessControl from "../../../middleware/access_control"
import {
  Quiz,
  Course,
  QuizAnswer,
  UserCourseRole,
  CourseTranslation,
} from "../../../models"
import UserCoursePartState from "../../../models/user_course_part_state"
import { CustomContext, CustomState } from "../../../types"
import { BadRequestError } from "../../../util/error"
import {
  checkAccessOrThrow,
  getAccessibleCourses,
  abilitiesByRole,
} from "../util"

const coursesRoutes = new Router<CustomState, CustomContext>({
  prefix: "/courses",
})
  .get("/:courseId/quizzes", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Quiz.getByCourseId(courseId)
  })

  .get("/", accessControl(), async ctx => {
    const user = ctx.state.user
    ctx.body = await getAccessibleCourses(user, "view")
  })

  .get("/:courseId", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    await checkAccessOrThrow(ctx.state.user, courseId, "view")
    ctx.body = await Course.getFlattenedById(courseId)
  })

  .get(
    "/:courseId/count-answers-requiring-attention",
    accessControl(),
    async ctx => {
      const courseId = ctx.params.courseId
      await checkAccessOrThrow(ctx.state.user, courseId, "view")
      ctx.body = await QuizAnswer.getManualReviewCountsByCourseId(courseId)
    },
  )
  .post("/:courseId/duplicate-course", accessControl(), async ctx => {
    const oldCourseId = ctx.params.courseId
    const name = ctx.request.body.name
    const abbr = ctx.request.body.abbr
    const languageId = ctx.request.body.lang
    await checkAccessOrThrow(ctx.state.user, oldCourseId, "duplicate")
    ctx.body = await Course.duplicateCourse(oldCourseId, name, abbr, languageId)
  })

  .post("/download-correspondence-file", accessControl(), async ctx => {
    const oldCourseId = ctx.request.body.oldCourseId
    const courseId = ctx.request.body.newCourseId
    ctx.response.set("Content-Type", "text/csv")
    ctx.response.attachment(`update_ids_from_${oldCourseId}_to_${courseId}.csv`)
    await checkAccessOrThrow(ctx.state.user, oldCourseId, "download")
    const stream = await Course.getCorrespondenceFile(oldCourseId, courseId)
    ctx.body = stream
  })

  .get("/:courseId/user/current/progress", accessControl(), async ctx => {
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
  })
  .get("/:courseId/user/abilities", accessControl(), async ctx => {
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
  .post("/:courseId/edit", accessControl(), async ctx => {
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

export default coursesRoutes

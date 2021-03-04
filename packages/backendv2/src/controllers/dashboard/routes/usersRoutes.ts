import Router from "koa-router"
import accessControl from "../../../middleware/access_control"
import { UserCourseRole } from "../../../models"
import { CustomContext, CustomState } from "../../../types"
import { abilitiesByRole, checkAccessOrThrow } from "../util"
import * as Kafka from "../../../services/kafka"

const userRoutes = new Router<CustomState, CustomContext>({
  prefix: "/users",
})
  .get("/current/abilities", accessControl(), async ctx => {
    const courseRoles = await UserCourseRole.getByUserId(ctx.state.user.id)
    const abilitiesByCourse: { [courseId: string]: string[] } = {}
    for (const courseRole of courseRoles) {
      abilitiesByCourse[courseRole.courseId] = abilitiesByRole[courseRole.role]
    }
    ctx.body = abilitiesByCourse
  })

  .get("/:userId/broadcast/:courseId", accessControl(), async ctx => {
    const { userId, courseId } = ctx.params
    await checkAccessOrThrow(ctx.state.user, courseId, "edit")
    await Kafka.broadcastUserCourse(userId, courseId)
  })

export default userRoutes

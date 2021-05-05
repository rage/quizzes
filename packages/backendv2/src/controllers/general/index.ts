import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import Quiz from "../../models/quiz"
import UserCoursePartState from "../../models/user_course_part_state"
import accessControl from "../../middleware/access_control"
import knex from "../../../database/knex"

const general = new Router<CustomState, CustomContext>({
  prefix: "/general",
})
  .get("/course/:courseId/progress", accessControl(), async ctx => {
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

  .get("/course/:courseId/quiz-titles", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    let quiz_titles: { [key: string]: string } = {}

    const result = await Quiz.getByCourseId(courseId)
    for (const quiz of result) {
      quiz_titles[quiz.id] = quiz.title
    }

    ctx.body = quiz_titles
  })

export default general

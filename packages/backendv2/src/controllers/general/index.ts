import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import { checkAccessOrThrow } from "../dashboard/util"
import { UserQuizState, Quiz } from "../../models/"
import accessControl from "../../middleware/access_control"

const general = new Router<CustomState, CustomContext>({
  prefix: "/general",
})
  .get("/course/:courseId/progress", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    const user = ctx.state.user
    const progress = await UserQuizState.getByUserAndCourse(user.id, courseId)
    ctx.body = progress
  })

  .get("/course/:courseId/quiz-titles", accessControl(), async ctx => {
    const courseId = ctx.params.courseId
    let quiz_titles: { [key: string]: string } = {}

    const result = await Quiz.getByCourseId(courseId)
    for (const quiz of result) {
      for (const quizItem of quiz.items) {
        quiz_titles[quizItem.id] = quizItem.title
      }
    }

    ctx.body = quiz_titles
  })

export default general

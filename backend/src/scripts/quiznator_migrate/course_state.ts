import { CourseState as QNCourseState } from "./app-modules/models"

import { Course, User, UserCourseState } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateCourseStates(
  courses: { [courseID: string]: Course },
  users: { [username: string]: User },
) {
  console.log("Querying course states...")
  const oldStates = await QNCourseState.find({})

  const bar = progressBar("Migrating course states", oldStates.length)
  await Promise.all(
    oldStates.map(
      async (courseState: any): Promise<UserCourseState> => {
        const user = users[courseState.answererId]
        if (!user) {
          bar.tick()
          return
        }

        const course = courses[getUUIDByString(courseState.courseId)]
        if (!course) {
          bar.tick()
          return
        }

        const completion = courseState.completion || {}

        const state = await UserCourseState.create({
          user: Promise.resolve(user),
          course: Promise.resolve(course),

          progress: completion.data.progress,
          score: completion.data.score,

          completed: completion.completed,
          completionDate: completion.completionDate,
        }).save()
        bar.tick()
        return state
      },
    ),
  )
}

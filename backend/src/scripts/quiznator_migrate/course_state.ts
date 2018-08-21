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
          return
        }

        const course = courses[getUUIDByString(courseState.courseId)]
        if (!course) {
          return
        }

        const existingCourseState = await UserCourseState.findOne({
          userId: user.id,
          courseId: course.id,
        })
        if (existingCourseState) {
          bar.tick()
          return
        }

        const completion = courseState.completion || {}

        await UserCourseState.create({
          userId: user.id,
          courseId: course.id,

          progress: completion.data.progress || 0,
          score: completion.data.score || 0,

          completed: completion.completed,
          completionDate: completion.completionDate,
        }).save()
        bar.tick()
      },
    ),
  )
}

import { CourseState as QNCourseState } from "./app-modules/models"

import { Course, User, UserCourseState } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateCourseStates(
  courses: { [courseID: string]: Course },
  users: { [username: string]: User },
): Promise<UserCourseState[]> {
  console.log("Querying course states...")
  const oldStates = await QNCourseState.find({})

  const bar = progressBar("Migrating course states", oldStates.length)
  const states = []
  for (const courseState of oldStates) {
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

    states.push(
      await UserCourseState.create({
        user,
        course,

        progress: completion.data.progress,
        score: completion.data.score,

        completed: completion.completed,
        completionDate: completion.completionDate,
      }).save(),
    )
    bar.tick()
  }
  return states
}

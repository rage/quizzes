import { CourseState as QNCourseState } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { Course, User, UserCourseState } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateCourseStates(
  courses: { [courseID: string]: Course },
  users: { [username: string]: User },
) {
  console.log("Querying course states...")
  const oldStates = await QNCourseState.find({})

  console.log("Converting course states...")
  const courseStates: Array<QueryPartialEntity<UserCourseState>> = []
  for (const courseState of oldStates) {
    const user = users[courseState.answererId]
    if (!user) {
      continue
    }

    const course = courses[getUUIDByString(courseState.courseId)]
    if (!course) {
      continue
    }

    const completion = courseState.completion || {}

    courseStates.push({
      userId: user.id,
      courseId: course.id,

      progress: completion.data.progress || 0,
      score: completion.data.score || 0,

      completed: completion.completed,
      completionDate: completion.completionDate,
      completionAnswersDate: completion.completionAnswersDate
    })
  }

  const bar = progressBar("Inserting course states", courseStates.length)
  const chunkSize = 10900
  for (let i = 0; i < courseStates.length; i += chunkSize) {
    await UserCourseState.createQueryBuilder()
      .insert()
      .values(courseStates.slice(i, i + chunkSize))
      .onConflict(`("user_id", "course_id") DO NOTHING`)
      .execute()
    bar.tick(chunkSize)
  }
}

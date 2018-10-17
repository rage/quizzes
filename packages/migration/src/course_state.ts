import { Course, User, UserCourseState } from "@quizzes/common/models"
import { CourseState as QNCourseState } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  calculateChunkSize,
  getUUIDByString,
  insert,
  progressBar,
} from "./util"

export async function migrateCourseStates(
  courses: { [courseID: string]: Course },
  users: { [username: string]: User },
) {
  console.log("Querying course states...")
  const oldStates = await QNCourseState.find({})

  let bar = progressBar("Converting course states", oldStates.length)
  const courseStates: Array<QueryPartialEntity<UserCourseState>> = []
  for (const courseState of oldStates) {
    const user = users[courseState.answererId]
    if (!user) {
      continue
    }

    const course =
      courses[getUUIDByString(courseState.courseId)] ||
      courses[getUUIDByString("default")]

    const completion = courseState.completion || {}

    courseStates.push({
      userId: user.id,
      courseId: course.id,

      progress: completion.data.progress || 0,
      score: completion.data.score || 0,

      completed: completion.completed,
      completionDate: completion.completionDate,
      completionAnswersDate: completion.completionAnswersDate,
    })
    bar.tick()
  }

  bar = progressBar("Inserting course states", courseStates.length)
  const chunkSize = calculateChunkSize(courseStates[0])
  for (let i = 0; i < courseStates.length; i += chunkSize) {
    const vals = courseStates.slice(i, i + chunkSize)
    await insert(UserCourseState, vals, `"user_id", "course_id"`)
    bar.tick(vals.length)
  }
}

import { createAction } from "typesafe-actions"
import { CourseListQuiz } from "../../types/Quiz"

export const setEditable = createAction("TOGGLE_EDITABLE", resolve => {
  return (quiz: CourseListQuiz) => resolve(quiz)
})

import { action, createAction } from "typesafe-actions"
import { CourseListQuiz } from "../../types/Quiz"
import { EditableQuiz } from "../../types/EditQuiz"

export const toggleEditable = action("TOGGLE_EDITABLE")

export const initializedQuiz = (quiz: EditableQuiz) =>
  action("INITIALIZED_QUIZ", quiz)

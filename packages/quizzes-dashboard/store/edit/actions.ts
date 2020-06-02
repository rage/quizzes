import { action } from "typesafe-actions"
import { EditableQuiz } from "../../types/EditQuiz"

export const toggleEditable = action("TOGGLED_EDITABLE")

export const initializedEditor = (quiz: EditableQuiz) =>
  action("INITIALIZED_EDITOR", quiz)

export const editedQuizBody = (newBody: string) =>
  action("EDITED_QUIZ_BODY", newBody)

import { action } from "typesafe-actions"
import { EditableQuiz } from "../../types/EditQuiz"

export const toggleEditable = action("TOGGLED_EDITABLE")

export const initializedEditor = (quiz: EditableQuiz) =>
  action("INITIALIZED_EDITOR", quiz)

export const editedQuizBody = (newBody: string, itemId: string) =>
  action("EDITED_QUIZ_ITEM_BODY", { body: newBody, id: itemId })

export const editedQuizTitle = (newTitle: string, itemId: string) =>
  action("EDITED_QUIZ_ITEM_TITLE", { title: newTitle, id: itemId })

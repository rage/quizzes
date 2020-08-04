import { action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import { initializedEditor, createdNewQuiz } from "../editorActions"

export const resultReducer = createReducer<string, action>("")
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.result,
  )
  .handleAction(createdNewQuiz, (state, action) => action.payload.quizId)

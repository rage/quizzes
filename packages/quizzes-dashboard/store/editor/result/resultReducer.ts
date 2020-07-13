import { action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import { initializedEditor } from "../editorActions"

export const resultReducer = createReducer<string, action>("").handleAction(
  initializedEditor,
  (state, action) => action.payload.normalizedQuiz.result,
)

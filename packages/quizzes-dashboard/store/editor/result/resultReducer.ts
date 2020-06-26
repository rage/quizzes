import { action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import { initializedEditor } from "../editorActions"

export const resultReducer = createReducer<string, action>("").handleAction(
  initializedEditor,
  (_state: any, action: action) => action.payload.quiz.result,
)

export default resultReducer

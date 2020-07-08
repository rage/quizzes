import { createReducer } from "typesafe-actions"
import { QuizVariables, action } from "../../../types/NormalizedQuiz"
import produce from "immer"
import { initializedEditor } from "../editorActions"

export const quizVariableReducers = createReducer<
  { [quizId: string]: QuizVariables },
  action
>({}).handleAction(initializedEditor, (state, action) => {
  return produce(state, draftState => {
    const init = { ...action.payload.nestedQuiz }
    draftState[action.payload.normalizedQuiz.result] = {
      initialState: init,
    }
  })
})

import { createReducer } from "typesafe-actions"
import produce from "immer"
import { action } from "../../types/NormalizedQuiz"
import { checkForChanges } from "./editorActions"
import _ from "lodash"
import { denormalize } from "normalizr"
import { normalizedQuiz } from "../../schemas"
import { Quiz } from "../../types/Quiz"

export const editorChangesReducer = createReducer<{ changes: boolean }, action>(
  {
    changes: false,
  },
).handleAction(checkForChanges, (state, action) => {
  return produce(state, draftState => {
    const initState: Quiz =
      action.payload.store.editor.quizVariables[
        action.payload.store.editor.quizId
      ].initialState

    let quizData = {
      quizzes: action.payload.store.editor.quizzes,
      items: action.payload.store.editor.items,
      options: action.payload.store.editor.options,
      quizId: action.payload.store.editor.quizId,
    }

    const newState: Quiz = denormalize(
      quizData.quizId,
      normalizedQuiz,
      quizData,
    )

    console.log(_.isEqual(initState, newState))

    draftState.changes = !_.isEqual(initState, newState)
  })
})

export default editorChangesReducer

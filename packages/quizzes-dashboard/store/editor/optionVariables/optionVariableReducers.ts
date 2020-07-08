import { createReducer } from "typesafe-actions"
import { OptionVariables, action } from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import produce from "immer"
import { setOptionEditing } from "./optionVariableActions"

export const optionVariableReducers = createReducer<
  { [optionId: string]: OptionVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      if (action.payload.quiz.options) {
        for (const [id, option] of Object.entries(
          action.payload.quiz.options,
        )) {
          draftState[id] = { optionEditing: false }
        }
      }
    })
  })

  .handleAction(setOptionEditing, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].optionEditing = action.payload.editing
    })
  })

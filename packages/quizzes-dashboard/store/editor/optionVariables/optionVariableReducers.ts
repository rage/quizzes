import { createReducer } from "typesafe-actions"
import { OptionVariables, action } from "../../../types/NormalizedQuiz"
import {
  initializedEditor,
  createdNewOption,
  deletedOption,
} from "../editorActions"
import produce from "immer"
import { setOptionEditing } from "./optionVariableActions"

export const optionVariableReducers = createReducer<
  { [optionId: string]: OptionVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      if (action.payload.normalizedQuiz.options) {
        for (const [id, option] of Object.entries(
          action.payload.normalizedQuiz.options,
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

  .handleAction(createdNewOption, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId] = {
        optionEditing: false,
      }
    })
  })

  .handleAction(deletedOption, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].optionEditing = false
      delete draftState[action.payload.optionId]
    })
  })

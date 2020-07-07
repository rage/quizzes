import { createReducer } from "typesafe-actions"
import { ItemVariables } from "../../../types/NormalizedQuiz"
import { action } from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import produce from "immer"
import _ from "lodash"
import {
  setAdvancedEditing,
  setScaleMax,
  setScaleMin,
} from "./itemVariableActions"

export const itemVariableReducers = createReducer<
  { [itemId: string]: ItemVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    console.log(state)
    return produce(state, draftState => {
      for (const [id, item] of Object.entries(action.payload.quiz.items)) {
        let array: number[] = []
        if (item.minValue && item.maxValue) {
          array = _.range(item.minValue, item.maxValue + 1)
        }
        draftState[id] = {
          advancedEditing: false,
          scaleMax: item.maxValue ?? 0,
          scaleMin: item.minValue ?? 0,
          validMax: true,
          validMin: true,
          array: array,
        }
      }
    })
  })

  .handleAction(setAdvancedEditing, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].advancedEditing = action.payload.editing
    })
  })

  .handleAction(setScaleMax, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].scaleMax = action.payload.newValue
      draftState[action.payload.itemId].validMax = action.payload.valid
      if (action.payload.valid) {
        draftState[action.payload.itemId].array = _.range(
          state[action.payload.itemId].scaleMin ?? 0,
          action.payload.newValue + 1,
        )
      }
    })
  })

  .handleAction(setScaleMin, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].scaleMin = action.payload.newValue
      draftState[action.payload.itemId].validMin = action.payload.valid
      if (action.payload.valid) {
        draftState[action.payload.itemId].array = _.range(
          action.payload.newValue,
          (state[action.payload.itemId].scaleMax ?? 0) + 1,
        )
      }
    })
  })

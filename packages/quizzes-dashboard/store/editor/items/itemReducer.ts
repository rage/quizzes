import { action, Item } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizItemBody,
  editedQuizItemTitle,
  editedScaleMinMaxLabel,
  editedScaleMinMaxValue,
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMessage,
  editedItemMaxWords,
  editedItemMinWords,
} from "./itemAction"
import { initializedEditor } from "../editorActions"
import produce from "immer"

export const itemReducer = createReducer<{ [itemId: string]: Item }, action>({})
  .handleAction(
    initializedEditor,
    (_state, action) => action.payload.quiz.items ?? {},
  )

  .handleAction(editedQuizItemBody, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].body = action.payload.body
    })
  })

  .handleAction(editedQuizItemTitle, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].title = action.payload.title
    })
  })

  .handleAction(editedScaleMinMaxValue, (state, action) => {
    return produce(state, draftState => {
      if (action.payload.max) {
        draftState[action.payload.itemId].maxValue = action.payload.newValue
      } else {
        draftState[action.payload.itemId].minValue = action.payload.newValue
      }
    })
  })

  .handleAction(editedValidityRegex, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].validityRegex = action.payload.newRegex
    })
  })

  .handleAction(toggledMultiOptions, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].multi = !state[action.payload.itemId]
        .multi
    })
  })

  .handleAction(editedItemMessage, (state, action) => {
    return produce(state, draftState => {
      if (action.payload.success) {
        draftState[action.payload.itemId].successMessage =
          action.payload.newMessage
      } else {
        draftState[action.payload.itemId].failureMessage =
          action.payload.newMessage
      }
    })
  })

  .handleAction(editedItemMaxWords, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].maxWords = action.payload.maxWords
    })
  })

  .handleAction(editedItemMinWords, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].maxWords = action.payload.minWords
    })
  })

export default itemReducer

import { action, Item } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizItemBody,
  editedQuizItemTitle,
  editedScaleMinMaxValue,
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMaxWords,
  editedItemMinWords,
  editedItemSuccessMessage,
  editedItemFailureMessage,
  editedSharedOptionsFeedbackMessage,
  toggledSharedOptionFeedbackMessage,
  deletedOptionFromItem,
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

  .handleAction(editedItemSuccessMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].successMessage =
        action.payload.newMessage
    })
  })

  .handleAction(editedItemFailureMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].failureMessage =
        action.payload.newMessage
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

  .handleAction(editedSharedOptionsFeedbackMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].sharedOptionFeedbackMessage =
        action.payload.newMessage
    })
  })

  .handleAction(toggledSharedOptionFeedbackMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].usesSharedOptionFeedbackMessage =
        action.payload.sharedFeedback
    })
  })

  .handleAction(deletedOptionFromItem, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].options = draftState[
        action.payload.itemId
      ].options.filter(optionId => optionId !== action.payload.optionId)
    })
  })

export default itemReducer

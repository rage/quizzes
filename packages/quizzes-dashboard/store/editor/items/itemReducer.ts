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
} from "./itemAction"
import { initializedEditor } from "../editorActions"

export const itemReducer = createReducer<{ [itemId: string]: Item }, action>({})
  .handleAction(
    initializedEditor,
    (_state, action) => action.payload.quiz.items ?? {},
  )

  .handleAction(editedQuizItemBody, (state, action) => {
    let newState = state
    newState[action.payload.id].body = action.payload.body
    return newState
  })

  .handleAction(editedQuizItemTitle, (state, action) => {
    let newState = state
    newState[action.payload.id].title = action.payload.title
    return newState
  })

  .handleAction(editedScaleMinMaxValue, (state, action) => {
    let newState = state
    if (action.payload.max) {
      newState[action.payload.itemId].maxValue = action.payload.newValue
    } else {
      newState[action.payload.itemId].minValue = action.payload.newValue
    }
    return newState
  })

  .handleAction(editedScaleMinMaxLabel, (state, action) => {
    let newState = state
    if (action.payload.max) {
      newState[action.payload.itemId].maxWords = action.payload.newLabel
    } else {
      newState[action.payload.itemId].minWords = action.payload.newLabel
    }
    return newState
  })

  .handleAction(editedValidityRegex, (state, action) => {
    let newState = state
    newState[action.payload.itemId].validityRegex = action.payload.newRegex
    return newState
  })

  .handleAction(toggledMultiOptions, (state, action) => {
    let newState = state
    newState[action.payload.itemId].multi = !newState[action.payload.itemId]
      .multi
    return newState
  })

  .handleAction(editedItemMessage, (state, action) => {
    let newState = state
    if (action.payload.success) {
      newState[action.payload.itemId].successMessage = action.payload.newMessage
    } else {
      newState[action.payload.itemId].failureMessage = action.payload.newMessage
    }
    return newState
  })

export default itemReducer

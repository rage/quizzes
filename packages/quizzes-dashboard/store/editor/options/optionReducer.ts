import { action, Option } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedOptionTitle,
  editedOptionCorrectnes,
  editedOptionSuccessMessage,
  editedOptionFailureMessage,
} from "./optionActions"
import {
  initializedEditor,
  deletedOption,
  createdNewOption,
} from "../editorActions"
import produce from "immer"

export const optionReducer = createReducer<
  { [optionId: string]: Option },
  action
>({})
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.options ?? {},
  )

  .handleAction(editedOptionTitle, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].title = action.payload.newTitle
    })
  })

  .handleAction(editedOptionCorrectnes, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].correct = action.payload.correct
    })
  })

  .handleAction(editedOptionSuccessMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].successMessage =
        action.payload.newMessage
    })
  })

  .handleAction(editedOptionFailureMessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].failureMessage =
        action.payload.newMessage
    })
  })

  .handleAction(createdNewOption, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId] = {
        id: action.payload.optionId,
        quizItemId: action.payload.itemId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: "",
        body: "",
        correct: false,
        order: 0,
        successMessage: "",
        failureMessage: "",
      }
    })
  })

  .handleAction(deletedOption, (state, action) => {
    return produce(state, draftState => {
      delete draftState[action.payload.optionId]
    })
  })

export default optionReducer

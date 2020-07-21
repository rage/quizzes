import { action, NormalizedOption } from "../../../types/NormalizedQuiz"
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
  createdNewQuiz,
} from "../editorActions"
import produce from "immer"
import { Quiz } from "../../../types/Quiz"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"

export const optionReducer = createReducer<
  { [optionId: string]: NormalizedOption },
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

  .handleAction(createdNewQuiz, (state, action) => {
    const init: Quiz = {
      id: action.payload.quizId,
      autoConfirm: false,
      autoReject: false,
      awardPointsEvenIfWrong: false,
      body: "",
      courseId: action.payload.courseId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: null,
      excludedFromScore: true,
      grantPointsPolicy: "grant_whenever_possible",
      items: [],
      open: null,
      part: 0,
      peerReviews: [],
      points: 0,
      section: 0,
      submitMessage: null,
      title: "",
      tries: 1,
      triesLimited: true,
    }

    const normalized = normalize(init, normalizedQuiz)
    return normalized.entities.options ?? {}
  })

export default optionReducer

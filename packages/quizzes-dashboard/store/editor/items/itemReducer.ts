import { action, NormalizedItem } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizItemBody,
  editedQuizItemTitle,
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMaxWords,
  editedItemMinWords,
  editedItemSuccessMessage,
  editedItemFailureMessage,
  editedSharedOptionsFeedbackMessage,
  toggledSharedOptionFeedbackMessage,
  editedScaleMaxValue,
  editedScaleMinValue,
} from "./itemAction"
import {
  initializedEditor,
  createdNewItem,
  deletedItem,
  createdNewOption,
  deletedOption,
  createdNewQuiz,
} from "../editorActions"
import produce from "immer"
import { Quiz } from "../../../types/Quiz"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"

export const itemReducer = createReducer<
  { [itemId: string]: NormalizedItem },
  action
>({})
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.items,
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

  .handleAction(editedScaleMaxValue, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].maxValue = action.payload.newValue
    })
  })

  .handleAction(editedScaleMinValue, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].minValue = action.payload.newValue
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

  .handleAction(createdNewItem, (state, action) => {
    return produce(state, draftState => {
      const newItem: NormalizedItem = {
        id: action.payload.itemId,
        quizId: action.payload.quizId,
        type: action.payload.type,
        title: "",
        body: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        successMessage: null,
        failureMessage: null,
        formatRegex: null,
        validityRegex: null,
        maxValue: null,
        minValue: null,
        maxWords: null,
        minWords: null,
        multi: false,
        order: 0,
        usesSharedOptionFeedbackMessage: false,
        sharedOptionFeedbackMessage: null,
        options: [],
      }
      draftState[action.payload.itemId] = newItem
    })
  })

  .handleAction(deletedItem, (state, action) => {
    return produce(state, draftState => {
      delete draftState[action.payload.itemId]
    })
  })

  .handleAction(createdNewOption, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].options.push(action.payload.optionId)
    })
  })

  .handleAction(deletedOption, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.itemId].options = draftState[
        action.payload.itemId
      ].options.filter(optionId => optionId !== action.payload.optionId)
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
    return normalized.entities.items ?? {}
  })

export default itemReducer

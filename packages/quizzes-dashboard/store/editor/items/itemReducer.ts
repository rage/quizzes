import { produce } from "immer"
import { normalize } from "normalizr"
import { createReducer } from "typesafe-actions"

import { normalizedQuiz } from "../../../schemas"
import { action, NormalizedItem } from "../../../types/NormalizedQuiz"
import { Quiz } from "../../../types/Quiz"
import {
  initializedEditor,
  createdNewItem,
  deletedItem,
  createdNewOption,
  deletedOption,
  createdNewQuiz,
} from "../editorActions"
import {
  editedQuizItemBody,
  editedQuizItemTitle,
  editedValidityRegex,
  editedFormatRegex,
  toggledMultiOptions,
  editedItemMaxWords,
  editedItemMinWords,
  editedItemSuccessMessage,
  editedItemFailureMessage,
  editedSharedOptionsFeedbackMessage,
  toggledSharedOptionFeedbackMessage,
  editedScaleMaxValue,
  editedScaleMinValue,
  increasedItemOrder,
  decreasedItemOrder,
  toggledAllAnswersCorrect,
  editedItemDirection,
  editedQuizItemFeedbackDisplayPolicy,
} from "./itemAction"

type ItemsById = { [itemId: string]: NormalizedItem }

const quizItemsByOrder = (items: ItemsById, quizId: string) =>
  Object.values(items)
    .filter((item) => item.quizId === quizId)
    .sort((a, b) => a.order - b.order)

/** The order for an item appended to the quiz; stored orders may start at 0 or 1. */
export const nextItemOrder = (items: ItemsById, quizId: string): number => {
  const orders = quizItemsByOrder(items, quizId).map((item) => item.order)
  return orders.length > 0 ? Math.max(...orders) + 1 : 0
}

/**
 * Moves an item one step (`direction` -1 or 1) among its quiz's items.
 *
 * Renumbers the quiz's items consecutively from their lowest order, which also repairs duplicates.
 */
export const moveItem = (
  items: ItemsById,
  itemId: string,
  direction: -1 | 1,
): ItemsById => {
  const sorted = quizItemsByOrder(items, items[itemId].quizId)
  const from = sorted.findIndex((item) => item.id === itemId)
  const to = from + direction
  if (to < 0 || to >= sorted.length) {
    return items
  }
  const baseOrder = sorted[0].order
  ;[sorted[from], sorted[to]] = [sorted[to], sorted[from]]
  return produce(items, (draftItems) => {
    sorted.forEach((item, index) => {
      draftItems[item.id].order = baseOrder + index
    })
  })
}

export const itemReducer = createReducer<
  { [itemId: string]: NormalizedItem },
  action
>({})
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.items,
  )

  .handleAction(editedQuizItemBody, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.id].body = action.payload.body
    })
  })

  .handleAction(editedQuizItemTitle, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.id].title = action.payload.title
    })
  })

  .handleAction(editedScaleMaxValue, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].maxValue = action.payload.newValue
    })
  })

  .handleAction(editedScaleMinValue, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].minValue = action.payload.newValue
    })
  })

  .handleAction(editedValidityRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].validityRegex = action.payload.newRegex
    })
  })

  .handleAction(editedFormatRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].formatRegex = action.payload.newRegex
    })
  })

  .handleAction(toggledMultiOptions, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].multi =
        !state[action.payload.itemId].multi
    })
  })

  .handleAction(editedItemSuccessMessage, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].successMessage =
        action.payload.newMessage
    })
  })

  .handleAction(editedItemFailureMessage, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].failureMessage =
        action.payload.newMessage
    })
  })

  .handleAction(editedItemMaxWords, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].maxWords = action.payload.maxWords
    })
  })

  .handleAction(editedItemMinWords, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].minWords = action.payload.minWords
    })
  })

  .handleAction(editedSharedOptionsFeedbackMessage, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].sharedOptionFeedbackMessage =
        action.payload.newMessage
    })
  })

  .handleAction(toggledSharedOptionFeedbackMessage, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].usesSharedOptionFeedbackMessage =
        action.payload.sharedFeedback
    })
  })

  .handleAction(editedQuizItemFeedbackDisplayPolicy, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].feedbackDisplayPolicy =
        action.payload.newPolicy
    })
  })

  .handleAction(createdNewItem, (state, action) => {
    return produce(state, (draftState) => {
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
        order: nextItemOrder(state, action.payload.quizId),
        usesSharedOptionFeedbackMessage: false,
        sharedOptionFeedbackMessage: null,
        options: [],
        allAnswersCorrect: false,
        direction: "row",
        feedbackDisplayPolicy: "DisplayFeedbackOnQuizItem",
      }
      draftState[action.payload.itemId] = newItem
    })
  })

  .handleAction(deletedItem, (state, action) => {
    return produce(state, (draftState) => {
      const deletedOrder = state[action.payload.itemId].order
      delete draftState[action.payload.itemId]
      for (let key in draftState) {
        if (draftState[key].order > deletedOrder) {
          draftState[key].order = draftState[key].order - 1
        }
      }
    })
  })

  .handleAction(createdNewOption, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].options.push(action.payload.optionId)
    })
  })

  .handleAction(deletedOption, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].options = draftState[
        action.payload.itemId
      ].options.filter((optionId) => optionId !== action.payload.optionId)
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
      excludedFromScore: false,
      grantPointsPolicy: "grant_whenever_possible",
      items: [],
      open: null,
      part: 0,
      peerReviewCollections: [],
      points: 1,
      section: 0,
      submitMessage: null,
      title: "",
      tries: 1,
      triesLimited: true,
    }

    const normalized = normalize(init, normalizedQuiz)
    return normalized.entities.items ?? {}
  })

  .handleAction(increasedItemOrder, (state, action) =>
    moveItem(state, action.payload.itemId, 1),
  )

  .handleAction(decreasedItemOrder, (state, action) =>
    moveItem(state, action.payload.itemId, -1),
  )

  .handleAction(toggledAllAnswersCorrect, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].allAnswersCorrect =
        !draftState[action.payload.itemId].allAnswersCorrect
    })
  })

  .handleAction(editedItemDirection, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].direction = action.payload.newDirection
    })
  })

export default itemReducer

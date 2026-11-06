import { produce } from "immer"
import _ from "lodash"
import { createReducer } from "typesafe-actions"

import { ItemVariables } from "../../../types/NormalizedQuiz"
import { action } from "../../../types/NormalizedQuiz"
import {
  initializedEditor,
  createdNewItem,
  deletedItem,
  createdNewOption,
  createdNewQuiz,
} from "../editorActions"
import {
  setAdvancedEditing,
  setScaleMax,
  setScaleMin,
  toggleValidRegexTestingState,
  toggleFormatRegexTestingState,
  setValidityTestRegex,
  setFormatTestRegex,
  setValidityRegexTestAnswer,
  setFormatRegexTestAnswer,
  setValidValidityRegex,
  setFormatValidityRegex,
} from "./itemVariableActions"

export const itemVariableReducers = createReducer<
  { [itemId: string]: ItemVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, (draftState) => {
      for (const [id, item] of Object.entries(
        action.payload.normalizedQuiz.items,
      )) {
        let array: number[] = []
        if (item.minValue && item.maxValue) {
          array = _.range(item.minValue, item.maxValue + 1)
        }
        draftState[id] = {
          scaleMax: item.maxValue ?? 0,
          scaleMin: item.minValue ?? 0,
          validMax: true,
          validMin: true,
          array: array,
          advancedEditing: false,
          testingRegex: false,
          testingFormatRegex: false,
          regex: item.validityRegex ?? "",
          formatRegex: item.formatRegex ?? "",
          validityRegexTestAnswer: "",
          formatRegexTestAnswer: "",
          validRegex: true,
          validFormatRegex: true,
          newOptions: [],
        }
      }
    })
  })

  .handleAction(setAdvancedEditing, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].advancedEditing = action.payload.editing
    })
  })

  .handleAction(setScaleMax, (state, action) => {
    return produce(state, (draftState) => {
      const variables = draftState[action.payload.itemId]
      variables.scaleMax = action.payload.newValue
      variables.validMax = action.payload.valid
      if (variables.validMin && variables.validMax) {
        variables.array = _.range(variables.scaleMin, variables.scaleMax + 1)
      }
    })
  })

  .handleAction(setScaleMin, (state, action) => {
    return produce(state, (draftState) => {
      const variables = draftState[action.payload.itemId]
      variables.scaleMin = action.payload.newValue
      variables.validMin = action.payload.valid
      if (variables.validMin && variables.validMax) {
        variables.array = _.range(variables.scaleMin, variables.scaleMax + 1)
      }
    })
  })

  .handleAction(toggleValidRegexTestingState, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].testingRegex = action.payload.testing
    })
  })

  .handleAction(toggleFormatRegexTestingState, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].testingFormatRegex =
        action.payload.testing
    })
  })

  .handleAction(setValidityTestRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].regex = action.payload.testRegex
    })
  })

  .handleAction(setFormatTestRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].formatRegex = action.payload.testRegex
    })
  })

  .handleAction(setValidityRegexTestAnswer, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].validityRegexTestAnswer =
        action.payload.testAnswer
    })
  })

  .handleAction(setFormatRegexTestAnswer, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].formatRegexTestAnswer =
        action.payload.testAnswer
    })
  })

  .handleAction(setValidValidityRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].validRegex = action.payload.valid
    })
  })

  .handleAction(setFormatValidityRegex, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].validFormatRegex = action.payload.valid
    })
  })

  .handleAction(createdNewItem, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId] = {
        advancedEditing: false,
        regex: "",
        formatRegex: "",
        validityRegexTestAnswer: "",
        formatRegexTestAnswer: "",
        scaleMax: 0,
        scaleMin: 0,
        testingRegex: false,
        testingFormatRegex: false,
        validMax: true,
        validMin: true,
        validRegex: true,
        validFormatRegex: true,
        array: [],
        newOptions: [],
      }
    })
  })

  .handleAction(deletedItem, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].advancedEditing = false
      delete draftState[action.payload.itemId]
    })
  })

  .handleAction(createdNewOption, (state, action) => {
    return produce(state, (draftState) => {
      draftState[action.payload.itemId].newOptions.push(action.payload.optionId)
    })
  })

  .handleAction(createdNewQuiz, (state, action) => {
    return {}
  })

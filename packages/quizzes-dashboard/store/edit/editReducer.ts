import { Item } from "../../types/EditQuiz"
import {
  QuizText,
  IPeerReviewCollection,
  QuizPointsGrantingPolicy,
} from "../../types/Quiz"

export interface actionType {
  type: string
  payload?: any
  meta?: any
}

export interface EditorState {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  tries: number
  triesLimited: boolean
  deadline: Date | null
  open: Date | null
  autoConfirm: boolean
  excludedFromScore: boolean
  texts: QuizText[]
  course: any
  items: Item[]
  grantPointsPolicy: QuizPointsGrantingPolicy
  peerReviews: IPeerReviewCollection[]
  createdAt: Date
  updatedAt: Date
  awardPointsEvenIfWrong: boolean
}

export interface EditorState2 {
  //entities: {
  course: {}
  items: {}
  quiz: {}
  texts: {}
  result: string
}

const initialState: EditorState = {
  id: "1",
  courseId: "2",
  tries: 0,
  triesLimited: true,
  deadline: null,
  open: null,
  autoConfirm: true,
  excludedFromScore: true,
  part: 0,
  section: 0,
  course: {
    languages: [],
  },
  texts: [],
  items: [],
  peerReviews: [],
  grantPointsPolicy: "grant_only_when_answer_fully_correct",
  points: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  awardPointsEvenIfWrong: false,
}

export const editReducer2 = (
  state: EditorState2 = {
    course: {},
    items: {},
    quiz: {},
    texts: {},
    result: "",
  },
  action: actionType,
): any => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log("initializer", action)
      return {
        ...state,
        ...action.payload.quiz,
      }
    }
    default: {
      console.log("default", action)
      return state
    }
  }
}

export const editReducer = (
  state: EditorState = initialState,
  action: actionType,
): EditorState => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      let newState = { ...initialState, ...action.payload.quiz }
      return newState
    }
    case "EDITED_QUIZ_ITEM_BODY": {
      let newState = state
      let editedItem = newState.items.find(
        item => item.id === action.payload.id,
      )
      if (editedItem === undefined) {
        return state
      }
      editedItem.texts[0].body = action.payload.body
      newState.items = [
        ...newState.items.filter(item => item.id !== action.payload.id),
        editedItem,
      ]
      return newState
    }
    case "EDITED_QUIZ_ITEM_TITLE": {
      let newState = state
      let editedItem = newState.items.find(
        item => item.id === action.payload.id,
      )
      if (editedItem === undefined) {
        return state
      }
      editedItem.texts[0].title = action.payload.title
      newState.items = [
        ...newState.items.filter(item => item.id !== action.payload.id),
        editedItem,
      ]
      return newState
    }
    case "EDITED_QUIZ_TITLE": {
      let newState = state
      newState.texts[0].title = action.payload.title
      return newState
    }
    case "EDITED_QUIZZES_NUMBER_OF_TRIES": {
      let newState = state
      newState.tries = action.payload.numberOfTries
      return newState
    }
    case "EDITED_QUIZZES_POINTS_TO_GAIN": {
      let newState = state
      newState.points = action.payload.pointsToGain
      return newState
    }
    case "EDITED_QUIZZES_POINTS_GRANTING_POLICY": {
      let newState = state
      newState.grantPointsPolicy = action.payload.policy
      return newState
    }
    case "EDITED_OPTION_TITLE": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id == action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }
      let wantedOption = wantedItem.options.find(
        option => option.id == action.payload.optionId,
      )
      if (!wantedOption) {
        return state
      }
      wantedOption.texts[0].title = action.payload.newTitle
      wantedItem.options = wantedItem.options.filter(
        option => option.id !== action.payload.optionId,
      )
      wantedItem.options = [...wantedItem.options, wantedOption]

      newState.items = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      newState.items = [...newState.items, wantedItem]
      return newState
    }
    case "EDITED_OPTION_CORRECTNES": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id === action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }
      let wantedOption = wantedItem.options.find(
        option => option.id === action.payload.optionId,
      )
      if (!wantedOption) {
        return state
      }
      wantedOption.correct = !wantedOption.correct
      wantedItem.options = wantedItem.options.filter(
        option => option.id !== action.payload.optionId,
      )
      wantedItem.options = [...wantedItem.options, wantedOption]
      wantedItem.options.sort((a, b) => b.order - a.order)

      newState.items = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )

      return { ...newState, items: [...newState.items, wantedItem] }
    }
    case "EDITED_SCALE_VALUE": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id === action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }

      if (action.payload.max) {
        wantedItem.maxValue = action.payload.newValue
      } else {
        wantedItem.minValue = action.payload.newValue
      }

      newState.items = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      let newItems = [...newState.items, wantedItem]
      newItems.sort((a, b) => a.order - b.order)
      return { ...newState, items: newItems }
    }
    case "EDITED_SCALE_LABEL": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id === action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }

      if (action.payload.max) {
        wantedItem.texts[0].maxLabel = action.payload.newLabel
      } else {
        wantedItem.texts[0].minLabel = action.payload.newLabel
      }

      newState.items = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      let newItems = [...newState.items, wantedItem]
      newItems.sort((a, b) => a.order - b.order)
      return { ...newState, items: newItems }
    }
    case "EDITED_VALIDITY_REGEX": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id === action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }
      wantedItem.validityRegex = action.payload.newRegex
      let newItems = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      newItems = [...newItems, wantedItem]
      return { ...newState, items: newItems }
    }
    case "TOGGLED_MULTI_OPTIONS": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id,
        action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }
      wantedItem.multi = !wantedItem.multi
      let newItems = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      newItems = [...newItems, wantedItem]
      return { ...newState, items: newItems }
    }
    case "EDITED_ITEM_MESSAGE": {
      let newState = state
      let wantedItem = newState.items.find(
        item => item.id === action.payload.itemId,
      )
      if (!wantedItem) {
        return state
      }
      if (action.payload.success) {
        wantedItem.texts[0].successMessage = action.payload.newMessage
      } else {
        wantedItem.texts[0].failureMessage = action.payload.newMessage
      }
      let newItems = newState.items.filter(
        item => item.id !== action.payload.itemId,
      )
      newItems = [...newItems, wantedItem]
      return { ...newState, items: newItems }
    }
    default: {
      return initialState
    }
  }
}

export default editReducer

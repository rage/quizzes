import { EditableQuiz, Item } from "../../types/EditQuiz"
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
  points?: number
  tries: number
  triesLimited: boolean
  deadline: Date
  open: Date
  autoConfirm: boolean
  excludedFromScore: boolean
  texts: QuizText[]
  course: any
  items: Item[]
  grantPointsPolicy: QuizPointsGrantingPolicy
  peerReviews: IPeerReviewCollection[]
  createdAt: Date
  updatedAt: Date
}

const initialState: EditorState = {
  id: "1",
  courseId: "2",
  tries: 0,
  triesLimited: true,
  deadline: new Date(),
  open: new Date(),
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
}

const editReducer = (
  state: EditorState = initialState,
  action: actionType,
): EditorState => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log(action)
      let newState = { ...initialState, ...action.payload }
      console.log(newState)
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
      newState.texts[0].title = action.payload
      return newState
    }
    case "EDITED_QUIZZES_NUMBER_OF_TRIES": {
      let newState = state
      newState.tries = action.payload
      return newState
    }
    case "EDITED_QUIZZES_POINTS_TO_GAIN": {
      let newState = state
      newState.points = action.payload
      return newState
    }
    case "EDITED_QUIZZES_POINTS_GRANTING_POLICY": {
      let newState = state
      newState.grantPointsPolicy = action.payload
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
      wantedOption.texts[0].title = action.payload.title
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
      newState.items = [...newState.items, wantedItem]

      return { ...newState, items: newState.items }
    }
    case "EDITED_SCALE_VALUE": {
      console.log(action)
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
      console.log(action)
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
    default: {
      return initialState
    }
  }
}

export default editReducer

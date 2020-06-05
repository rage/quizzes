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
  id?: string
  courseId?: string
  part: number
  section: number
  points?: number
  tries?: number
  triesLimited?: boolean
  deadline?: Date
  open?: Date
  autoConfirm?: boolean
  excludedFromScore?: boolean
  texts: QuizText[]
  course: any
  items: Item[]
  grantPointsPolicy?: QuizPointsGrantingPolicy
  peerReviewCollections?: IPeerReviewCollection[]
}

const initialState: EditorState = {
  part: 0,
  section: 0,
  course: {
    languages: [],
  },
  texts: [],
  items: [],
  peerReviewCollections: [],
}

const editReducer = (
  state: EditorState = initialState,
  action: actionType,
): EditorState => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      return { ...initialState, ...action.payload.quiz }
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
      let newSate = state
      let wantedItem = newSate.items.find(
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

      newSate.items = newSate.items.filter(
        item => item.id !== action.payload.itemId,
      )
      newSate.items = [...newSate.items, wantedItem]
      return newSate
    }
    default: {
      return initialState
    }
  }
}

export default editReducer

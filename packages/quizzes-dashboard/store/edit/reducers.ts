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
  editable: boolean
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
  editable: true,
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
    case "TOGGLED_EDITABLE": {
      return { ...state, editable: !state.editable }
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
    default: {
      return initialState
    }
  }
}

export default editReducer

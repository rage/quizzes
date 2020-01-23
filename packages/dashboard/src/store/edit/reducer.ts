import { getType } from "typesafe-actions"
import {
  ICourse,
  IPeerReviewCollection,
  IQuizItem,
  IQuizItemOption,
  IQuizText,
  QuizPointsGrantingPolicy,
} from "../../interfaces"
import * as edit from "./actions"

export interface IEditState {
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
  texts: IQuizText[]
  course: any
  items: IQuizItem[]
  grantPointsPolicy?: QuizPointsGrantingPolicy
  peerReviewCollections?: IPeerReviewCollection[]
}

const initialState: IEditState = {
  part: 0,
  section: 0,
  course: {
    languages: [],
  },
  texts: [],
  items: [],
  peerReviewCollections: [],
}

export const editReducer = (
  state: IEditState = initialState,
  action,
): IEditState => {
  let newOptions
  switch (action.type) {
    case getType(edit.set):
      const deadline = action.payload.deadline
      if (deadline && typeof deadline === "string") {
        action.payload.deadline = new Date(deadline)
      }
      return action.payload
    case getType(edit.create):
      return { ...initialState, ...action.payload }
    case getType(edit.removeOption):
      const option: IQuizItemOption = action.payload
      if (!option) {
        return state
      }
      const item = state.items.find(it => it.id === option.quizItemId)
      if (!item) {
        return state
      }
      newOptions = item.options.filter(opt => opt.id !== option.id)
      let prevOrder = -1
      newOptions.forEach(opt => (opt.order = ++prevOrder))
      return {
        ...state,
        items: state.items.map(it =>
          it.id !== item.id ? it : { ...it, options: newOptions },
        ),
      }
    case getType(edit.swapOptionOrders):
      const { quizItem, optionIdx1, optionIdx2 } = action.payload

      const oldQuizItem = state.items.find(qi => qi.id === quizItem.id)

      newOptions = createSwappedOptions(oldQuizItem, optionIdx1, optionIdx2)

      if (newOptions === undefined) {
        return state
      }

      return {
        ...state,
        items: state.items.map(it =>
          it.id !== quizItem.id ? it : { ...it, options: newOptions },
        ),
      }
    default:
      return state
  }
}

const createSwappedOptions = (
  quizItem: IQuizItem | undefined,
  idx1: number,
  idx2: number,
): IQuizItemOption[] | undefined => {
  const option1 = quizItem && quizItem.options.find(opt => opt.order === idx1)
  const option2 = quizItem && quizItem.options.find(opt => opt.order === idx2)

  if (!quizItem || !option1 || !option2) {
    return undefined
  }

  const newOptions = quizItem.options.map(e => e)
  const temp = newOptions[idx1]
  temp.order = idx2
  newOptions[idx1] = newOptions[idx2]
  newOptions[idx1].order = idx1
  newOptions[idx2] = temp
  console.log("New options: ", newOptions)
  return newOptions
}

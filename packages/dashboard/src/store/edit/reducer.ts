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
  unsaved: boolean
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
  unsaved: false,
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
    case getType(edit.modifyOptionOrder):
      const { quizItem, optionIdx1, optionIdx2 } = action.payload

      const oldQuizItem = state.items.find(qi => qi.id === quizItem.id)

      newOptions = createNewlyOrderedOptions(
        oldQuizItem,
        optionIdx1,
        optionIdx2,
      )

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

const createNewlyOrderedOptions = (
  quizItem: IQuizItem | undefined,
  oldIndex: number,
  newIndex: number,
): IQuizItemOption[] | undefined => {
  if (!quizItem) {
    return undefined
  }

  if (newIndex === oldIndex) {
    return quizItem.options
  }
  // the only affected order numbers are between [min{old, new}, ..., max{old, new}]
  const min = oldIndex < newIndex ? oldIndex : newIndex
  const max = min === oldIndex ? newIndex : oldIndex

  const options = quizItem.options.map(e => e)

  const start = options.slice(0, min)
  const middle = options.slice(min, max + 1)
  const end = options.slice(max + 1)

  if (oldIndex === min) {
    const option = middle.shift()!
    option.order = newIndex
    middle.forEach(opt => {
      opt.order--
    })
    middle.push(option)
  } else {
    const option = middle.pop()!
    option.order = newIndex
    middle.forEach(opt => {
      opt.order++
    })
    middle.unshift(option)
  }

  return start.concat(middle).concat(end)
}

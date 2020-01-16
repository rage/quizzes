import { getType } from "typesafe-actions"
import {
  ICourse,
  IPeerReviewCollection,
  IQuizItem,
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
  switch (action.type) {
    case getType(edit.set):
      const deadline = action.payload.deadline
      if (deadline && typeof deadline === "string") {
        action.payload.deadline = new Date(deadline)
      }
      return action.payload
    case getType(edit.create):
      return { ...initialState, ...action.payload }
    default:
      return state
  }
}

import { getType } from "typesafe-actions"
import * as edit from "./actions"

const initialState = {
  part: 0,
  section: 0,
  course: {
    languages: [],
  },
  texts: [],
  items: [],
  peerReviewCollections: [],
}

export const editReducer = (state = initialState, action) => {
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

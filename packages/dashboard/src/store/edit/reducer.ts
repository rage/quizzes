import { getType } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import * as edit from "./actions"

const initialState = {
  part: 0,
  section: 0,
  course: {
    languages: [],
  },
  texts: [],
  items: [],
  peerReviewQuestions: [],
}

export const editReducer = (state = initialState, action) => {
  switch (action.type) {
    case getType(edit.set):
      return action.payload
    case getType(edit.create):
      return { ...initialState, ...action.payload }
    default:
      return state
  }
}

import { getType } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import * as edit from "./actions"

const initialState = {
  course: "",
}

export const editReducer = (state = initialState, action) => {
  switch (action.type) {
    case getType(edit.set):
      return action.payload
    case getType(edit.newq):
      console.log("reducer")
      return initialState
    default:
      return state
  }
}

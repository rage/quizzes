import { getType } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import * as edit from "./actions"

const initialState = {
  __course__: "",
}

export const editReducer = (state = initialState, action) => {
  switch (action.type) {
    case getType(edit.set):
      return action.payload
    case getType(edit.newq):
      return initialState
    default:
      return state
  }
}

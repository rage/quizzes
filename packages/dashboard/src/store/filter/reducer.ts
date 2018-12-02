import { getType } from "typesafe-actions"
import * as filter from "./actions"

const initialState = {
  course: "",
  language: "",
}

export const filterReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case getType(filter.set):
      return Object.assign({}, state, action.payload)
    case getType(filter.clear):
      return initialState
    default:
      return state
  }
}

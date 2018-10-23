import { getType } from "typesafe-actions"
import * as filter from "./actions"

export const filterReducer = (state: any = null, action: any) => {
  switch (action.type) {
    case getType(filter.set):
      return action.payload
    case getType(filter.clear):
      return null
    default:
      return state
  }
}

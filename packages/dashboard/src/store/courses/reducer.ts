import { getType } from "typesafe-actions"
import * as courses from "./actions"

export const coursesReducer = (state: any = [], action: any) => {
  switch (action.type) {
    case getType(courses.set):
      return action.payload
    case getType(courses.clear):
      return []
    default:
      return state
  }
}

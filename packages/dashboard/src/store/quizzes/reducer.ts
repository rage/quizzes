import { getType } from "typesafe-actions"
import * as quizzes from "./actions"

export const quizzesReducer = (state: any = [], action: any) => {
  switch (action.type) {
    case getType(quizzes.set):
      return action.payload
    case getType(quizzes.clear):
      return []
    default:
      return state
  }
}
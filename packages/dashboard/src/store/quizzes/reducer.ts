import { ActionType, getType } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models/quiz"
import * as quizzes from "./actions"

export const quizzesReducer = (
  state: any = [],
  action: ActionType<typeof quizzes>,
) => {
  switch (action.type) {
    case getType(quizzes.set):
      return [...state, ...action.payload]
    case getType(quizzes.remove):
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1),
      ]
    case getType(quizzes.clear):
      return []
    default:
      return state
  }
}

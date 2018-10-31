import { ActionType, getType } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models/quiz"
import * as quizzes from "./actions"

export const quizzesReducer = (
  state: Quiz[] = [],
  action: ActionType<typeof quizzes>,
) => {
  switch (action.type) {
    case getType(quizzes.set):
      return action.payload
    case getType(quizzes.clear):
      return []
    default:
      return state
  }
}

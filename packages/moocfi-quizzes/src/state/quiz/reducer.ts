import { ActionType, getType } from "typesafe-actions"
import * as quiz from "./actions"
import { Quiz } from "../../modelTypes"

const initialValue = null

export const quizReducer = (
  state: Quiz = initialValue,
  action: ActionType<typeof quiz>,
): Quiz => {
  switch (action.type) {
    case getType(quiz.set):
      return action.payload
    case getType(quiz.clear):
      return initialValue
    default:
      return state
  }
}

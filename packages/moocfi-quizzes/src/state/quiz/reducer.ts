import { ActionType, getType } from "typesafe-actions"
import * as quiz from "./actions"
import { Quiz } from "../../modelTypes"

type QuizState = Quiz | null

const initialValue = null

export const quizReducer = (
  state: QuizState = initialValue,
  action: ActionType<typeof quiz>,
): QuizState => {
  switch (action.type) {
    case getType(quiz.set):
      return action.payload
    case getType(quiz.clear):
      return initialValue
    default:
      return state
  }
}

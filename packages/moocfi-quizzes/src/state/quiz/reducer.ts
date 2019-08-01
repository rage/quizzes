import { ActionType, getType } from "typesafe-actions"
import * as quiz from "./actions"
import { Quiz } from "../../modelTypes"

type QuizState = Quiz | null

export const initialState = null

export const quizReducer = (
  state: QuizState = initialState,
  action: ActionType<typeof quiz>,
): QuizState => {
  switch (action.type) {
    case getType(quiz.set):
      return action.payload
    case getType(quiz.clear):
      return initialState
    default:
      return state
  }
}

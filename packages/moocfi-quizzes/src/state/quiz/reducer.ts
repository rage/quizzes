import { ActionType, getType } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models"
import * as quiz from "./actions"

export type QuizState = {
  quiz: Quiz
}

const initialValue = null

export const quizReducer = (
  state: QuizState = initialValue,
  action: ActionType<typeof quiz>,
) => {
  switch (action.type) {
    case getType(quiz.set):
      return action.payload
    case getType(quiz.clear):
      return initialValue
    default:
      return state
  }
}

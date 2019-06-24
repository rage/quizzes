import { ActionType, getType } from "typesafe-actions"
import { QuizAnswer } from "../../../../common/src/models"
import * as quizAnswer from "./actions"

const initialValue = null

export const quizAnswerReducer = (
  state: QuizAnswer = initialValue,
  action: ActionType<typeof quizAnswer>,
) => {
  switch (action.type) {
    case getType(quizAnswer.set):
      return action.payload
    case getType(quizAnswer.clear):
      return initialValue
    default:
      return state
  }
}

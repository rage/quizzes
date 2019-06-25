import { ActionType, getType } from "typesafe-actions"
import * as quizAnswer from "./actions"

const initialValue = null

export type QuizOptionAnswerState = {
  id: string
  quizItemAnswerId: string
  quizOptionId: string
}

export type QuizItemAnswerState = {
  id: string
  quizAnswerId: string
  quizItemId: string
  textData: string
  intData: number
  correct: boolean
  optionAnswers: QuizOptionAnswerState[]
}

export type QuizAnswerState = {
  id?: string
  quizId: string
  userId: 96010
  languageId: string
  status:
    | "draft"
    | "submitted"
    | "spam"
    | "confirmed"
    | "rejected"
    | "deprecated"
  itemAnswers: QuizItemAnswerState[]
}

export const quizAnswerReducer = (
  state: QuizAnswerState = initialValue,
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

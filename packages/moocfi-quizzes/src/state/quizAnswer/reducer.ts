import { ActionType, getType } from "typesafe-actions"
import * as quizAnswer from "./actions"

const initialValue = null

export type QuizOptionAnswer = {
  id?: string
  quizItemAnswerId: string
  quizOptionId: string
}

export type QuizOptionAnswerState = Readonly<QuizOptionAnswer>

export type QuizItemAnswer = {
  id?: string
  quizAnswerId: string
  quizItemId: string
  textData: string
  intData: number
  correct: boolean
  optionAnswers: QuizOptionAnswerState[]
}
export type QuizItemAnswerState = Readonly<QuizItemAnswer>

export type QuizAnswer = {
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
export type QuizAnswerState = Readonly<QuizAnswer>

export const quizAnswerReducer = (
  state: QuizAnswerState = initialValue,
  action: ActionType<typeof quizAnswer>,
): QuizAnswerState => {
  switch (action.type) {
    case getType(quizAnswer.set):
      return action.payload
    case getType(quizAnswer.clear):
      return initialValue
    default:
      return state
  }
}

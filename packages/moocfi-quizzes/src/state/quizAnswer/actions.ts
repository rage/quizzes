import { createAction } from "typesafe-actions"
import { QuizAnswerState } from "./reducer"

export const set = createAction("quizAnswer/SET", resolve => {
  return (quizAnswer: QuizAnswerState) => resolve(quizAnswer)
})

export const clear = createAction("quizAnswer/CLEAR")

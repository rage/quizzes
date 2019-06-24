import { createAction } from "typesafe-actions"
import { QuizAnswer } from "../../../../common/src/models"

export const set = createAction("quizAnswer/SET", resolve => {
  return (quizAnswer: QuizAnswer) => resolve(quizAnswer)
})

export const clear = createAction("quizAnswer/CLEAR")

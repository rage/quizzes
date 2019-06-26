import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { getQuizInfo } from "../../services/quizService"
import { ThunkAction } from "../store"
import { QuizState } from "./reducer"

export const set = createAction("quiz/SET", resolve => {
  return (quiz: QuizState) => resolve(quiz)
})

export const clear = createAction("quiz/CLEAR")

export const setQuiz: ActionCreator<ThunkAction> = (quizId: string) => async (
  dispatch,
  getState,
) => {
  const languageId = getState().language.languageId
  const accessToken = getState().user.accessToken

  if (!accessToken) {
    throw new Error("Access token is not set")
  }

  const { quiz } = await getQuizInfo(quizId, languageId, accessToken)
  await dispatch(set(quiz))
}

import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { getQuizInfo } from "../../services/quizService"
import { ThunkAction } from "../store"
import { Quiz } from "../../modelTypes"
import * as loadingBarsActions from "../loadingBars/actions"

export const set = createAction("quiz/SET", resolve => {
  return (quiz: Quiz) => resolve(quiz)
})

export const setTitle = createAction(
  "quiz/SET_TITLE",
  resolve => (title: string) => resolve(title),
)

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

  const address = getState().backendAddress
  const { quiz } = await getQuizInfo(quizId, languageId, accessToken, address)
  dispatch(set(quiz))
  dispatch(loadingBarsActions.set(false))
}

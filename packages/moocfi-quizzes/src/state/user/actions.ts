import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"
import { UserState } from "./reducer"
import { QuizAnswerStatePayload, UserQuizState } from "../../modelTypes"

export const set = createAction("user/SET", resolve => {
  return (newState: UserState) => resolve(newState)
})

export const setToken = createAction("user/SET_ACCESS_TOKEN", resolve => {
  return (accessToken: string) => resolve(accessToken)
})

export const setQuizState = createAction(
  "user/SET_USER_QUIZ_STATE",
  resolve => {
    return (payload: QuizAnswerStatePayload) => resolve(payload)
  },
)

export const setUserQuizState: ActionCreator<ThunkAction> = (
  userQuizState: UserQuizState,
) => {
  return (dispatch, getState) => {
    dispatch(
      setQuizState({
        quiz: getState().quiz,
        quizAnswer: getState().quizAnswer.quizAnswer,
        userQuizState,
      }),
    )
  }
}

export const clear = createAction("user/CLEAR")

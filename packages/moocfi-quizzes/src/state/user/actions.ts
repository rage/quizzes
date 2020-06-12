import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"
import { UserState } from "./reducer"
import { Quiz, QuizAnswerStatePayload, UserQuizState } from "../../modelTypes"
import { getQuizInfo, QuizResponse } from "../../services/quizService"
import { setAnswer } from "../quizAnswer/actions"

export const set = createAction("user/SET", (resolve) => {
  return (newState: UserState) => resolve(newState)
})

export const setToken = createAction("user/SET_ACCESS_TOKEN", (resolve) => {
  return (accessToken: string) => resolve(accessToken)
})

export const setQuizState = createAction(
  "user/SET_USER_QUIZ_STATE",
  (resolve) => {
    return (payload: QuizAnswerStatePayload) => resolve(payload)
  },
)

export const setUserQuizState: ActionCreator<ThunkAction> = (
  userQuizState: UserQuizState,
) => {
  return (dispatch, getState) => {
    dispatch(
      setQuizState({
        quiz: getState().quiz as Quiz,
        quizAnswer: getState().quizAnswer.quizAnswer,
        userQuizState,
      }),
    )
  }
}

export const updateQuizState: ActionCreator<ThunkAction> = () => {
  return async (dispatch, getState) => {
    const responseData = (await getQuizInfo(
      getState().quiz?.id || "",
      getState().user.accessToken,
      getState().backendAddress,
      true,
    )) as QuizAnswerStatePayload
    dispatch(setQuizState(responseData))
    dispatch(setAnswer(responseData.quizAnswer))
  }
}

export const clear = createAction("user/CLEAR")

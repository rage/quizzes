import { createAction } from "typesafe-actions"
import { UserState } from "./reducer"
import { UserQuizState } from "../../modelTypes"

export const set = createAction("user/SET", resolve => {
  return (newState: UserState) => resolve(newState)
})

export const setToken = createAction("user/SET_ACCESS_TOKEN", resolve => {
  return (accessToken: string) => resolve(accessToken)
})

export const setQuizState = createAction(
  "user/SET_USER_QUIZ_STATE",
  resolve => {
    return (userQuizState: UserQuizState) => resolve(userQuizState)
  },
)

export const clear = createAction("user/CLEAR")

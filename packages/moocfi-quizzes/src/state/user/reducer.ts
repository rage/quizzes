import { ActionType, getType } from "typesafe-actions"
import * as user from "./actions"
import { UserQuizState } from "../../modelTypes"

export type UserState = {
  accessToken: string
  userQuizState: UserQuizState | null
}

export const initialState = {
  accessToken: "",
  userQuizState: null,
}

export const userReducer = (
  state: UserState = initialState,
  action: ActionType<typeof user>,
): UserState => {
  switch (action.type) {
    case getType(user.set):
      return action.payload
    case getType(user.setToken):
      return { ...state, accessToken: action.payload }
    case getType(user.setQuizState):
      return { ...state, userQuizState: action.payload.userQuizState }
    case getType(user.clear):
      return initialState
    default:
      return state
  }
}

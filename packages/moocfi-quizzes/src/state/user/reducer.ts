import { ActionType, getType } from "typesafe-actions"
import * as user from "./actions"
import { UserQuizState } from "../../modelTypes"

export type UserState = {
  accessToken: string
  userQuizState: UserQuizState
}

const initialValue = {
  accessToken: null,
  userQuizState: null,
}

export const userReducer = (
  state: UserState = initialValue,
  action: ActionType<typeof user>,
): UserState => {
  switch (action.type) {
    case getType(user.set):
      return action.payload
    case getType(user.setToken):
      return { ...state, accessToken: action.payload }
    case getType(user.setQuizState):
      return { ...state, userQuizState: action.payload }
    case getType(user.clear):
      return initialValue
    default:
      return state
  }
}

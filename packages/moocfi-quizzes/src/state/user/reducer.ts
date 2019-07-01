import { ActionType, getType } from "typesafe-actions"
import * as user from "./actions"

export type UserQuizState = {
  userId: number
  quizId: string
  peerReviewsGiven: number
  peerReviewsReceived: number
  pointsAwarded: number
  spamFlags: number
  tries: number
  status: "open" | "locked"
}

export type User = {
  accessToken: string
  userQuizState: UserQuizState
}

export type UserState = {
  readonly accessToken: string
  readonly userQuizState: UserQuizState
}

const initialValue = {
  accessToken: null,
  userQuizState: null,
}

export const userReducer = (
  state: UserState = initialValue,
  action: ActionType<typeof user>,
): User => {
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

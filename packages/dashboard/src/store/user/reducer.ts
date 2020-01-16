import { ActionType, getType } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import * as user from "./actions"

export type userState = ITMCProfile | null

export type UserAction = ActionType<typeof user>

export const userReducer = (
  state: userState = null,
  action: UserAction,
): userState => {
  switch (action.type) {
    case getType(user.set):
      return action.payload
    case getType(user.clear):
      return null
    default:
      return state
  }
}

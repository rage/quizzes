import { ActionType, getType } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import * as user from "./actions"

type userState = ITMCProfile | null
export type UserAction = ActionType<typeof user>

export const userReducer = (state: userState = null, action: UserAction) => {
  switch (action.type) {
    case getType(user.add):
      return action.payload
    case getType(user.remove):
      return null
    default:
      return state
  }
}

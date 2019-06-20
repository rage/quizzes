import { ActionType, getType } from "typesafe-actions"
import * as user from "./actions"

const initialValue = null

export const userReducer = (
  state: string = initialValue,
  action: ActionType<typeof user>,
) => {
  switch (action.type) {
    case getType(user.set):
      return action.payload
    case getType(user.clear):
      return initialValue
    default:
      return state
  }
}

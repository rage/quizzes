import { getType } from "typesafe-actions"
import * as notification from "./actions"

export const notificationReducer = (
  state: string | null = null,
  action: any,
) => {
  switch (action.type) {
    case getType(notification.set):
      return action.payload
    case getType(notification.clear):
      return null
    default:
      return state
  }
}

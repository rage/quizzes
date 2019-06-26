import { ActionType, getType } from "typesafe-actions"
import * as message from "./actions"

const initialValue = null

export const messageReducer = (
  state: string = initialValue,
  action: ActionType<typeof message>,
): string => {
  switch (action.type) {
    case getType(message.set):
      return action.payload
    case getType(message.clear):
      return initialValue
    default:
      return state
  }
}

import { ActionType, getType } from "typesafe-actions"
import * as message from "./actions"

const initialValue = null

type MessageState = string | null

export const messageReducer = (
  state: MessageState = initialValue,
  action: ActionType<typeof message>,
): MessageState => {
  switch (action.type) {
    case getType(message.set):
      return action.payload
    case getType(message.clear):
      return initialValue
    default:
      return state
  }
}

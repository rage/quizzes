import { ActionType, getType } from "typesafe-actions"
import * as message from "./actions"

const initialValue = {
  errorMessage: null,
  notification: null,
}

export type MessageState = {
  errorMessage: string | null
  notification: {
    message: string
    color: string
  } | null
}

export const messageReducer = (
  state: MessageState = initialValue,
  action: ActionType<typeof message>,
): MessageState => {
  switch (action.type) {
    case getType(message.setErrorMessage):
      return {
        ...state,
        errorMessage: action.payload,
      }
    case getType(message.setNotification):
      return {
        ...state,
        notification: {
          message: action.payload.message,
          color: action.payload.color,
        },
      }
    case getType(message.clearErrorMessage):
      return {
        ...state,
        errorMessage: initialValue.errorMessage,
      }
    case getType(message.clearNotification):
      return {
        ...state,
        notification: initialValue.notification,
      }
    case getType(message.clear):
      return initialValue
    default:
      return state
  }
}

import { ActionType, getType } from "typesafe-actions"
import * as message from "./actions"

export const initialState = {
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
  state: MessageState = initialState,
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
        errorMessage: initialState.errorMessage,
      }
    case getType(message.clearNotification):
      return {
        ...state,
        notification: initialState.notification,
      }
    case getType(message.clear):
      return initialState
    default:
      return state
  }
}

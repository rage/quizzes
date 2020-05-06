import { ActionType, getType } from "typesafe-actions"
import * as message from "./actions"

export const initialState = {
  fatal: false,
  error: false,
  info: false,
  message: "",
  /*errorMessage: null,
  notification: null,
  notificationDisplayedUntilAnswerChanges: false,*/
}

export type MessageState = {
  fatal: boolean
  error: boolean
  info: boolean
  message: string
  /*errorMessage: string | null
  notification: {
    message: string
    color: string
  } | null
  notificationDisplayedUntilAnswerChanges: boolean*/
}

export const messageReducer = (
  state: MessageState = initialState,
  action: ActionType<typeof message>,
): MessageState => {
  switch (action.type) {
    case getType(message.fatalErrorOccurred):
      return {
        ...state,
        fatal: true,
        message: action.payload,
      }
    case getType(message.errorOccurred):
      return {
        ...state,
        error: true,
        message: action.payload,
      }
    case getType(message.notify):
      return {
        ...state,
        info: true,
        message: action.payload,
      }
    case getType(message.clear):
      return initialState
    /*case getType(message.setErrorMessage):
      return {
        ...state,
        errorMessage: action.payload,
      }
    case getType(message.answerWasChanged):
      if (state.notificationDisplayedUntilAnswerChanges) {
        return {
          ...state,
          notification: null,
          notificationDisplayedUntilAnswerChanges: false,
        }
      }
      return state
    case getType(message.setNotification):
      return {
        ...state,
        notification: {
          message: action.payload.message,
          color: action.payload.color,
        },
        notificationDisplayedUntilAnswerChanges:
          action.payload.untilAnswerChanged,
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
      }*/
    default:
      return state
  }
}

import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { MessageState } from "./reducer"
import { ThunkAction } from "../store"

export const set = createAction("message/SET", resolve => {
  return (message: MessageState) => resolve(message)
})

export const setErrorMessage = createAction(
  "message/SET_ERROR_MESSAGE",
  resolve => {
    return (errorMessage: string) => resolve(errorMessage)
  },
)

export const clearErrorMessage = createAction("message/CLEAR_ERROR_MESSAGE")

export const setNotification = createAction(
  "message/SET_NOTIFICATION",
  resolve => {
    return (message: string, color: string = "black") =>
      resolve({ message, color })
  },
)

export const clearNotification = createAction("message/CLEAR_NOTIFICATION")

export const displayNotification: ActionCreator<ThunkAction> = (
  message: string,
  color: string,
  lengthInSeconds?: number,
) => async dispatch => {
  dispatch(setNotification(message, color))

  if (lengthInSeconds) {
    setTimeout(() => dispatch(clearNotification()), 1000 * lengthInSeconds)
  }
}

export const clear = createAction("message/CLEAR")

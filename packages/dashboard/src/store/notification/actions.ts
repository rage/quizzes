import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"

export const set = createAction("notification/SET", (resolve) => {
  return (message: string, isError: boolean) => resolve({ message, isError })
})

export const clear = createAction("notification/CLEAR")

export const displayMessage = (
  message: string,
  isError: boolean,
  seconds: number = 5,
) => {
  return (dispatch: Dispatch<ActionType<typeof set | typeof clear>>) => {
    dispatch(set(message, isError))
    setTimeout(() => dispatch(clear()), 1000 * seconds)
  }
}

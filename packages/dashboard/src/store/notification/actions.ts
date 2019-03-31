import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"

export const set = createAction("notification/SET", resolve => {
  return (message: string) => resolve(message)
})

export const clear = createAction("notification/CLEAR")

export const displayMessage = (message: string, seconds: number) => {
  return (dispatch: Dispatch<ActionType<typeof set | typeof clear>>) => {
    dispatch(set(message))
    setTimeout(() => dispatch(clear()), 1000 * seconds)
  }
}

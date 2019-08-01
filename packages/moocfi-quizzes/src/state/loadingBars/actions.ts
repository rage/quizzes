import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"

export const set = createAction("loadingBars/SET", resolve => {
  return (newValue: boolean) => resolve(newValue)
})

export const InitializeLoadingBarsAfterDelay: ActionCreator<ThunkAction> = (
  lengthInSeconds: number = 1,
) => async (dispatch, getState) => {
  setTimeout(() => {
    if (!getState().quiz) {
      dispatch(set(true))
    }
  }, 1000 * lengthInSeconds)
}

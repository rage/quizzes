import { ActionType, getType } from "typesafe-actions"
import * as loadingBars from "./actions"

export const initialState = false

export type LoadingBarsState = boolean

export const loadingBarsReducer = (
  state: LoadingBarsState = initialState,
  action: ActionType<typeof loadingBars>,
): LoadingBarsState => {
  switch (action.type) {
    case getType(loadingBars.set):
      return action.payload
    default:
      return state
  }
}

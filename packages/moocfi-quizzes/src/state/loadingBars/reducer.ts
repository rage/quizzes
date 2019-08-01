import { ActionType, getType } from "typesafe-actions"
import * as loadingBars from "./actions"

const initialValue = false

export type LoadingBarsState = boolean

export const loadingBarsReducer = (
  state: LoadingBarsState = initialValue,
  action: ActionType<typeof loadingBars>,
): LoadingBarsState => {
  switch (action.type) {
    case getType(loadingBars.set):
      return action.payload
    default:
      return state
  }
}

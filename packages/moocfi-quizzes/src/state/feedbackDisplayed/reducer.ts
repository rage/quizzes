import { ActionType, getType } from "typesafe-actions"
import * as feedbackDisplayed from "./actions"

export const initialState = false

export const feedbackDisplayedReducer = (
  state: boolean = initialState,
  action: ActionType<typeof feedbackDisplayed>,
): boolean => {
  switch (action.type) {
    case getType(feedbackDisplayed.hide):
      return false
    case getType(feedbackDisplayed.display):
      return true
    default:
      return state
  }
}

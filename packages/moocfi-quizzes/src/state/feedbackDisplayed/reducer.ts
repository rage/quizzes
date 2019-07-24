import { ActionType, getType } from "typesafe-actions"
import * as feedbackDisplayed from "./actions"

const initialValue = false

export const feedbackDisplayedReducer = (
  state: boolean = initialValue,
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

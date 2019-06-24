import { ActionType, getType } from "typesafe-actions"
import * as submitLocked from "./actions"

const initialValue = false

export const submitLockedReducer = (
  state: boolean = initialValue,
  action: ActionType<typeof submitLocked>,
) => {
  switch (action.type) {
    case getType(submitLocked.set):
      return action.payload
    case getType(submitLocked.clear):
      return initialValue
    default:
      return state
  }
}

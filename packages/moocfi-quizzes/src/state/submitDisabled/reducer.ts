import { ActionType, getType } from "typesafe-actions"
import * as submitDisabled from "./actions"

const initialValue = false

export const submitLockedReducer = (
  state: boolean = initialValue,
  action: ActionType<typeof submitDisabled>,
) => {
  switch (action.type) {
    case getType(submitDisabled.set):
      return action.payload
    case getType(submitDisabled.clear):
      return initialValue
    default:
      return state
  }
}

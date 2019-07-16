import { ActionType, getType } from "typesafe-actions"
import BASE_URL from "../../config"
import * as backendAddress from "./actions"

const initialValue = BASE_URL

export const backendAddressReducer = (
  state: string = initialValue,
  action: ActionType<typeof backendAddress>,
): string => {
  switch (action.type) {
    case getType(backendAddress.clear):
      return initialValue
    case getType(backendAddress.set):
      return action.payload
    default:
      return state
  }
}

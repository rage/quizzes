import { ActionType, getType } from "typesafe-actions"
import BASE_URL from "../../config"
import * as backendAddress from "./actions"

export const initialState = BASE_URL

export const backendAddressReducer = (
  state: string = initialState,
  action: ActionType<typeof backendAddress>,
): string => {
  switch (action.type) {
    case getType(backendAddress.clear):
      return initialState
    case getType(backendAddress.set):
      return action.payload
    default:
      return state
  }
}

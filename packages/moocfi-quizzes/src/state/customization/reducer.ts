import { ActionType, getType } from "typesafe-actions"
import * as customization from "./actions"

export interface ICustomizationState {
  alwaysShowPoints: boolean
}

export const initialState = {
  alwaysShowPoints: true,
}

export const customizationReducer = (
  state: ICustomizationState = initialState,
  action: ActionType<typeof customization>,
): ICustomizationState => {
  switch (action.type) {
    case getType(customization.modify_always_show_points):
      return {
        ...state,
        alwaysShowPoints: action.payload,
      }
    default:
      return state
  }
}

import { ActionType, getType } from "typesafe-actions"
import * as customization from "./actions"

export interface ICustomizationState {
  showPointsInfo: boolean
}

export const initialState = {
  showPointsInfo: true,
}

export const customizationReducer = (
  state: ICustomizationState = initialState,
  action: ActionType<typeof customization>,
): ICustomizationState => {
  switch (action.type) {
    case getType(customization.modify_show_points_info):
      return {
        ...state,
        showPointsInfo: action.payload,
      }
    default:
      return state
  }
}

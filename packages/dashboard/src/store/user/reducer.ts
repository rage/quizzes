import { ActionType, getType } from "typesafe-actions"
import * as user from "./actions"

export enum InitializationStatus {
  UNINITIALIZED,
  INITIALIZING,
  INITIALIZED,
}
export interface IUserState {
  initializationStatus: InitializationStatus
  username: string
  accessToken: string
  roles: null | any[]
  administrator: boolean
}

const initialState = {
  initializationStatus: InitializationStatus.UNINITIALIZED,
  username: "",
  accessToken: "",
  roles: null,
  administrator: false,
}

export type UserAction = ActionType<typeof user>

export const userReducer = (
  state: IUserState = initialState,
  action: UserAction,
): IUserState => {
  switch (action.type) {
    case getType(user.set):
      return {
        ...action.payload,
        initializationStatus: InitializationStatus.INITIALIZED,
      }
    case getType(user.setRoles):
      return {
        ...state,
        administrator: action.payload.administrator,
        roles: action.payload.roles,
      }
    case getType(user.clear):
      return initialState
    default:
      return state
  }
}

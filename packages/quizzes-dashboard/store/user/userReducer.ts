import { createReducer } from "typesafe-actions"
import { action } from "../../types/NormalizedQuiz"
import { initUserState, setUser, clearUser } from "./userActions"
export interface UserState {
  loggedIn: boolean
  userName: string
  accessToken: string
  admin: boolean
}

const initialUserState: UserState = {
  loggedIn: false,
  userName: "",
  accessToken: "",
  admin: false,
}

const userReducer = createReducer<UserState, action>(initialUserState)
  .handleAction(initUserState, () => initialUserState)
  .handleAction(setUser, (state, action) => {
    let newState = state
    newState.accessToken = action.payload.accessToken
    newState.userName = action.payload.userName
    newState.admin = action.payload.admin
    newState.loggedIn = true
    return newState
  })
  .handleAction(clearUser, () => initialUserState)

export default userReducer

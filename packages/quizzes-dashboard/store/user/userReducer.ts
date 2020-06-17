export interface ActionType {
  type: string
  payload?: any
  meta?: any
}

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

const userReducer = (
  state: UserState = initialUserState,
  action: ActionType,
) => {
  switch (action.type) {
    case "INITIALIZED_USER_STATE": {
      return initialUserState
    }
    case "SET_USER": {
      return {
        loggedIn: true,
        userName: action.payload.userName,
        accessToken: action.payload.accessToken,
        admin: action.payload.admin,
      }
    }
    case "CLEAR_USER": {
      return initialUserState
    }
    default:
      return state
  }
}

export default userReducer

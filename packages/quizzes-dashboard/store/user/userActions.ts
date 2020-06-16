import { createAction } from "typesafe-actions"

export const initUserState = createAction("INITIALIZED_USER_STATE")()

export const setUser = createAction(
  "SET_USER",
  (userName: string, accessToken: string, admin: boolean) => ({
    userName: userName,
    accessToken: accessToken,
    admin: admin,
  }),
)<{ userName: string; accessToken: string; admin: boolean }>()

export const clearUser = createAction("CLEAR_USER")()

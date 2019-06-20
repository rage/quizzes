import { createAction } from "typesafe-actions"

export const set = createAction("user/SET", resolve => {
  return (accessToken: string) => resolve(accessToken)
})

export const clear = createAction("user/CLEAR")

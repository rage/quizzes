import { createAction } from "typesafe-actions"

export const set = createAction("message/SET", resolve => {
  return (message: string) => resolve(message)
})

export const clear = createAction("message/CLEAR")

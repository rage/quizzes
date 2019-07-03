import { createAction } from "typesafe-actions"

export const set = createAction("submitDisabled/SET", resolve => {
  return (status: boolean) => resolve(status)
})

export const clear = createAction("submitDisabled/CLEAR")

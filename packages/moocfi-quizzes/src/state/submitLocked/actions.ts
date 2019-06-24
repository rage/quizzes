import { createAction } from "typesafe-actions"

export const set = createAction("submitLocked/SET", resolve => {
  return (status: boolean) => resolve(status)
})

export const clear = createAction("submitLocked/CLEAR")

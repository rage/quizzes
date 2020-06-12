import { createAction } from "typesafe-actions"

export const set = createAction("backendAddress/SET", (resolve) => {
  return (address: string) => resolve(address)
})

export const clear = createAction("backendAddress/CLEAR")

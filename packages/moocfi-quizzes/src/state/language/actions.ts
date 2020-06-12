import { createAction } from "typesafe-actions"

export const set = createAction("language/SET", (resolve) => {
  return (languageId: string) => resolve(languageId)
})

export const clear = createAction("language/CLEAR")

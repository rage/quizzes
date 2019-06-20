import { createAction } from "typesafe-actions"

export const set = createAction("peerReview/SET", resolve => {
  return (something: any) => resolve(something)
})

export const clear = createAction("peerReview/CLEAR")

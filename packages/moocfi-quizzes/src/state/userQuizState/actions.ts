import { createAction } from "typesafe-actions"
import { UserQuizState } from "../../../../common/src/models"

export const set = createAction("userQuizState/SET", resolve => {
  return (userQuizState: UserQuizState) => resolve(userQuizState)
})

export const clear = createAction("userQuizState/CLEAR")

import { ActionType, getType } from "typesafe-actions"
import { UserQuizState } from "../../../../common/src/models"
import * as userQuizState from "./actions"

const initialValue = null

export const userQuizStateReducer = (
  state: UserQuizState = initialValue,
  action: ActionType<typeof userQuizState>,
) => {
  switch (action.type) {
    case getType(userQuizState.set):
      return action.payload
    case getType(userQuizState.clear):
      return initialValue
    default:
      return state
  }
}

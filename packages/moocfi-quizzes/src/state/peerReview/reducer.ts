import { ActionType, getType } from "typesafe-actions"
import * as peerReview from "./actions"

const initialValue = null

export const peerReviewReducer = (
  state: any = initialValue,
  action: ActionType<typeof peerReview>,
) => {
  switch (action.type) {
    case getType(peerReview.set):
      return state
    case getType(peerReview.clear):
      return initialValue
    default:
      return state
  }
}

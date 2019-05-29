import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
// import { PeerReview } from "../../../../common/src/models/peer_review"

export const peerReviewsReducer = (
  state: any[] | null = null,
  action: ActionType<typeof peerReviews>,
) => {
  switch (action.type) {
    case getType(peerReviews.set):
      return action.payload
    case getType(peerReviews.clear):
      return null
    default:
      return state
  }
}

import { ActionType, getType } from "typesafe-actions"
import * as receivedReviews from "./actions"
import { IReceivedPeerReview } from "../../modelTypes"

export interface IReceivedReviewsState {
  reviews: Array<IReceivedPeerReview> | null
  loadingState: receivedReviews.LoadingState
}

export const initialState: IReceivedReviewsState = {
  reviews: null,
  loadingState: "loading",
}

export const receivedReviewsReducer = (
  state: IReceivedReviewsState = initialState,
  action: ActionType<typeof receivedReviews>,
): IReceivedReviewsState => {
  switch (action.type) {
    case getType(receivedReviews.setLoadingState):
      return { ...state, loadingState: action.payload }
    case getType(receivedReviews.setReviews):
      const newReviews = action.payload.map(review => {
        if (typeof review.createdAt === "string") {
          return { ...review, createdAt: new Date(review.createdAt) }
        }
        return review
      })
      return { reviews: newReviews, loadingState: "done" }
    default:
      return state
  }
}

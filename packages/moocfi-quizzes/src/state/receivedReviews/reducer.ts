import { ActionType, getType } from "typesafe-actions"
import * as receivedReviews from "./actions"
import { IReceivedPeerReview } from "../../modelTypes"

export interface IReceivedReviewsState {
  reviews: Array<IReceivedPeerReview>
  loadingState: receivedReviews.LoadingState
}

export const initialState: IReceivedReviewsState = {
  reviews: [],
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
      return { reviews: action.payload, loadingState: "done" }
    default:
      return state
  }
}

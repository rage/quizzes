import { createAction } from "typesafe-actions"
import { PeerReviewAnswer, PeerReviewsState } from "./reducer"

export const set = createAction("peerReviews/SET", resolve => {
  return (newState: PeerReviewsState) => resolve(newState)
})

export const setReviewAnswer = createAction(
  "peerReviews/SET_ANSWER",
  resolve => {
    return (peerReview: PeerReviewAnswer) => resolve(peerReview)
  },
)

export const setReviewOptions = createAction(
  "peerReviews/SET_OPTIONS",
  resolve => {
    return (answerOptions: any[]) => resolve(answerOptions)
  },
)

export const setSubmitLocked = (newValue: boolean) => (dispatch, getState) => {
  dispatch(set({ ...getState().peerReviews, submitLocked: newValue }))
}

export const setSubmitDisabled = (newValue: boolean) => (
  dispatch,
  getState,
) => {
  dispatch(set({ ...getState().peerReviews, submitDisabled: newValue }))
}

export const clear = createAction("peerReviews/CLEAR")

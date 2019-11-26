import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"
import * as messageActions from "../message/actions"

import { getReceivedReviews } from "../../services/peerReviewService"
import { IReceivedPeerReview } from "../../modelTypes"

export type LoadingState = "began" | "loading" | "done" | "error"

export const setReviews = createAction(
  "receivedReviews/SET_REVIEWS",
  resolve => (peerReviews: Array<IReceivedPeerReview>) => resolve(peerReviews),
)

export const setLoadingState = createAction(
  "receivedReviews/SET_LOADING_STATE",
  resolve => (loadingState: LoadingState) => resolve(loadingState),
)

export const requestReviews: ActionCreator<ThunkAction> = () => async (
  dispatch,
  getState,
) => {
  dispatch(setLoadingState("began"))
  setTimeout(() => {
    // if not finished loading
    if (getState().receivedReviews.loadingState === "began") {
      dispatch(setLoadingState("loading"))
    }
  }, 1500)
  const answerId = getState().quizAnswer.quizAnswer.id
  const accessToken = getState().user.accessToken
  if (!answerId || !accessToken) {
    dispatch(
      messageActions.setErrorMessage(
        "Something unexpected occurred -- try reloading",
      ),
    )
    return
  }

  try {
    const reviews = await getReceivedReviews(
      answerId,
      accessToken,
      getState().backendAddress,
    )
    dispatch(setReviews(reviews))
  } catch (e) {
    dispatch(setLoadingState("error"))
  }
}

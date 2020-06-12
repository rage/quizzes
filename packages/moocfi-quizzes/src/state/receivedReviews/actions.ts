import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"
import * as messageActions from "../message/actions"

import { getReceivedReviews } from "../../services/peerReviewService"
import { IReceivedPeerReview } from "../../modelTypes"

export type LoadingState = "began" | "loading" | "done" | "error"

export const setReviews = createAction(
  "receivedReviews/SET_REVIEWS",
  (resolve) => (peerReviews: Array<IReceivedPeerReview>) =>
    resolve(peerReviews),
)

export const setLoadingState = createAction(
  "receivedReviews/SET_LOADING_STATE",
  (resolve) => (loadingState: LoadingState) => resolve(loadingState),
)

export const requestReviews: ActionCreator<ThunkAction> = () => async (
  dispatch,
  getState,
) => {
  try {
    const answerId = getState().quizAnswer.quizAnswer.id || ""
    const accessToken = getState().user.accessToken
    const reviews = await getReceivedReviews(
      answerId,
      accessToken,
      getState().backendAddress,
    )

    dispatch(setReviews(reviews))
  } catch (error) {
    const labels = getState().language.languageLabels
    dispatch(
      messageActions.errorOccurred(
        (labels && labels.receivedPeerReviews.errorLabel) || "error",
      ),
    )
  }
}

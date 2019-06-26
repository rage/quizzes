import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { PeerReviewAnswer, PeerReviewsState } from "./reducer"
import {
  getPeerReviewInfo,
  postPeerReview,
  postSpamFlag,
} from "../../services/peerReviewService"
import { setQuizState } from "../user/actions"
import { ThunkAction } from "../store"

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

export const changeGrade = createAction(
  "peerReviews/CHANGE_GRADE",
  resolve => (peerReviewQuestionId: string, value: number) =>
    resolve({ peerReviewQuestionId, value }),
)

export const submit = () => async (dispatch, getState) => {
  const peerReview = getState().peerReviews.answer
  const accessToken = getState().user.accessToken
  dispatch(setSubmitDisabled(true))
  dispatch(setSubmitLocked(true))
  const { userQuizState } = await postPeerReview(peerReview, accessToken)
  dispatch(setQuizState(userQuizState))
  dispatch(setReviewAnswer(undefined))
  await dispatch(fetchPeerReviewAlternatives())
}

export const postSpam: ActionCreator<ThunkAction> = (
  quizAnswerId: string,
) => async (dispatch, getState) => {
  const accessToken = getState().user.accessToken
  setReviewOptions(undefined)
  await postSpamFlag(quizAnswerId, accessToken)
  fetchPeerReviewAlternatives()
}

export const fetchPeerReviewAlternatives: ActionCreator<
  ThunkAction
> = () => async (dispatch, getState) => {
  const accessToken = getState().user.accessToken
  const quiz = getState().quiz
  const languageId = getState().user.accessToken

  const answerAlternatives = await getPeerReviewInfo(
    quiz.id,
    languageId,
    accessToken,
  )
  dispatch(setReviewOptions(answerAlternatives))
}

export const setSubmitLocked: ActionCreator<ThunkAction> = (
  newValue: boolean,
) => (dispatch, getState) => {
  dispatch(set({ ...getState().peerReviews, submitLocked: newValue }))
}

export const setSubmitDisabled = (newValue: boolean) => (
  dispatch,
  getState,
) => {
  dispatch(set({ ...getState().peerReviews, submitDisabled: newValue }))
}

export const clear = createAction("peerReviews/CLEAR")

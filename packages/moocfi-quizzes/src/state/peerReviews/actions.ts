import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { PeerReviewsState } from "./reducer"
import {
  getPeerReviewInfo,
  postPeerReview,
  postSpamFlag,
} from "../../services/peerReviewService"
import { setQuizState } from "../user/actions"
import { ThunkAction, RootAction } from "../store"
import { PeerReviewAnswer } from "../../modelTypes"

export const set = createAction("peerReviews/SET", resolve => {
  return (newState: PeerReviewsState) => resolve(newState)
})

export const setReviewAnswer = createAction(
  "peerReviews/SET_ANSWER",
  resolve => {
    return (peerReview: PeerReviewAnswer) => resolve(peerReview)
  },
)

export const selectAnswer = createAction(
  "peerReview/SELECT_ANSWER",
  resolve => {
    return (
      quizAnswerId: string,
      userId: number,
      peerReviewCollectionId: string,
      questionIds: string[],
    ) => resolve({ quizAnswerId, userId, peerReviewCollectionId, questionIds })
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

// solves the problem of passing info from userState, quizState -> peerReviewReducer
export const selectAnswerToReview: ActionCreator<ThunkAction> = (
  quizAnswerId: string,
) => (dispatch, getState) => {
  const userId = getState().user.userQuizState.userId
  const prc = getState().quiz.peerReviewCollections[0]
  dispatch(
    selectAnswer(quizAnswerId, userId, prc.id, prc.questions.map(q => q.id)),
  )
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

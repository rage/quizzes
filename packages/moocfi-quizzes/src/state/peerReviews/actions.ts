import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { PeerReviewsState } from "./reducer"
import {
  getPeerReviewInfo,
  postPeerReview,
  postSpamFlag,
} from "../../services/peerReviewService"
import { setQuizState } from "../user/actions"
import { ThunkAction } from "../store"
import { PeerReviewAnswer } from "../../modelTypes"

export const set = createAction("peerReviews/SET", resolve => {
  return (newState: PeerReviewsState) => resolve(newState)
})

export const setReviewAnswer = createAction(
  "peerReviews/SET_ANSWER",
  resolve => {
    return (peerReview: PeerReviewAnswer | null) => resolve(peerReview)
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

export const submit: ActionCreator<ThunkAction> = () => async (
  dispatch,
  getState,
) => {
  const peerReview = getState().peerReviews.answer
  if (!peerReview) {
    return
  }
  const accessToken = getState().user.accessToken
  dispatch(setSubmitDisabled(true))
  const address = getState().backendAddress
  const { userQuizState } = await postPeerReview(
    peerReview,
    accessToken,
    address,
  )
  dispatch(setQuizState(userQuizState))
  dispatch(setReviewAnswer(null))
  await dispatch(fetchPeerReviewAlternatives())
}

// solves the problem of passing info from userState, quizState -> peerReviewReducer
export const selectAnswerToReview: ActionCreator<ThunkAction> = (
  quizAnswerId: string,
) => (dispatch, getState) => {
  const user = getState().user
  if (!user) {
    console.log("user not set")
    return
  }
  if (!user.userQuizState) {
    console.log("uqs not set")
    return
  }

  const userId = user.userQuizState.userId
  const prc = getState().quiz.peerReviewCollections[0]
  dispatch(
    selectAnswer(quizAnswerId, userId, prc.id, prc.questions.map(q => q.id)),
  )
}

export const postSpam: ActionCreator<ThunkAction> = (
  quizAnswerId: string,
) => async (dispatch, getState) => {
  const accessToken = getState().user.accessToken
  setReviewOptions([])
  const address = getState().backendAddress
  await postSpamFlag(quizAnswerId, accessToken, address)
  fetchPeerReviewAlternatives()
}

export const fetchPeerReviewAlternatives: ActionCreator<
  ThunkAction
> = () => async (dispatch, getState) => {
  const accessToken = getState().user.accessToken
  const quiz = getState().quiz
  const languageId = getState().language.languageId

  const address = getState().backendAddress
  const answerAlternatives = await getPeerReviewInfo(
    quiz.id,
    languageId,
    accessToken,
    address,
  )
  dispatch(setReviewOptions(answerAlternatives))
}

export const setSubmitDisabled: ActionCreator<ThunkAction> = (
  newValue: boolean,
) => (dispatch, getState) => {
  dispatch(set({ ...getState().peerReviews, submitDisabled: newValue }))
}

export const clear = createAction("peerReviews/CLEAR")

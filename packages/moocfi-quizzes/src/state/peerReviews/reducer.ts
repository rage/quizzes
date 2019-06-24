import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"

const initialValue = {
  options: [],
  answer: null,
  submitLocked: true,
  submitDisabled: true,
}

type PeerReviewGradeAnswer = {
  peerReviewQuestionId: string
  value: number
}

type PeerReviewEssayAnswer = {
  peerReviewQuestionId: string
  text: string
}

type PeerReviewQuestionAnswer = PeerReviewGradeAnswer | PeerReviewEssayAnswer

export type PeerReviewAnswer = {
  quizAnswerId: string
  peerReviewCollectionId: string
  userId: number
  rejectedQuizAnswerIds: string[]
  answers: PeerReviewGradeAnswer[]
}

export type PeerReviewsState = {
  answer: PeerReviewAnswer
  options: any[]
  submitLocked: boolean
  submitDisabled: boolean
}

export const peerReviewsReducer = (
  state: PeerReviewsState = initialValue,
  action: ActionType<typeof peerReviews>,
) => {
  switch (action.type) {
    case getType(peerReviews.set):
      return action.payload
    case getType(peerReviews.setReviewAnswer):
      return { ...state, answer: action.payload }
    case getType(peerReviews.setReviewOptions):
      return { ...state, options: action.payload }
    case getType(peerReviews.clear):
      return initialValue
    default:
      return state
  }
}

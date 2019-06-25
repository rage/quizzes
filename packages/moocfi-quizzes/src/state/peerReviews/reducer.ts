import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
import { QuizAnswerState as QuizAnswer } from "../quizAnswer/reducer"

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
  answers: PeerReviewQuestionAnswer[]
}

export type PeerReviewsState = {
  answer: PeerReviewAnswer
  options: QuizAnswer[]
  submitLocked: boolean
  submitDisabled: boolean
}

export const peerReviewsReducer = (
  state: PeerReviewsState = initialValue,
  action: ActionType<typeof peerReviews>,
): PeerReviewsState => {
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

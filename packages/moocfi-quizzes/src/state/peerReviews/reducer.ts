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

type PeerReviewQuestionAnswer = PeerReviewGradeAnswer
// not supported yet
// | PeerReviewEssayAnswer

export type PeerReviewAnswer = {
  quizAnswerId: string
  peerReviewCollectionId: string
  userId: number
  rejectedQuizAnswerIds: string[]
  answers: PeerReviewQuestionAnswer[]
}

export type PeerReviews = {
  answer: PeerReviewAnswer
  options: QuizAnswer[]
  submitLocked: boolean
  submitDisabled: boolean
}

export type PeerReviewsState = Readonly<PeerReviews>

export const peerReviewsReducer = (
  state: PeerReviewsState = initialValue,
  action: ActionType<typeof peerReviews>,
): PeerReviews => {
  switch (action.type) {
    case getType(peerReviews.set):
      return action.payload
    case getType(peerReviews.setReviewAnswer):
      return { ...state, answer: action.payload }
    case getType(peerReviews.setReviewOptions):
      return { ...state, options: action.payload }
    case getType(peerReviews.clear):
      return initialValue
    case getType(peerReviews.changeGrade):
      const { peerReviewQuestionId, value } = action.payload
      const newAnswer = {
        ...state.answer,
        answers: state.answer.answers.map(answer =>
          answer.peerReviewQuestionId === peerReviewQuestionId
            ? { ...answer, value }
            : answer,
        ),
      }
      const submitDisabled = newAnswer.answers.find(
        answer => !answer.hasOwnProperty("value"),
      )
        ? true
        : false
      return {
        ...state,
        answer: newAnswer,
        submitDisabled,
      }
    case getType(peerReviews.selectAnswer):
      const {
        quizAnswerId,
        userId,
        peerReviewCollectionId,
        questionIds,
      } = action.payload

      const answersToReview = state.options
      const rejected = answersToReview.filter(
        answer => answer.id !== quizAnswerId,
      )

      const peerReviewAnswer = {
        quizAnswerId,
        userId,
        peerReviewCollectionId,
        rejectedQuizAnswerIds: rejected.map(x => x.id),
        answers: questionIds.map(questionId => {
          return { peerReviewQuestionId: questionId, value: null }
        }),
      }
      return {
        ...state,
        answer: peerReviewAnswer,
        submitLocked: false,
      }
    default:
      return state
  }
}

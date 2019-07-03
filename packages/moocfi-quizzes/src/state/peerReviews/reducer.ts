import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
import { QuizAnswer, PeerReviewAnswer } from "../../modelTypes"

const initialValue = {
  options: [],
  answer: null,
  submitLocked: true,
  submitDisabled: true,
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

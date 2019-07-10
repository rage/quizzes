import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewGradeAnswer,
} from "../../modelTypes"

const initialValue = {
  options: [],
  answer: null,
  submitDisabled: true,
}

export type PeerReviewsState = {
  answer: PeerReviewAnswer | null
  options: QuizAnswer[]
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
      const currentAnswer = state.answer
      if (!currentAnswer) {
        console.log("peer review answer is null")
        return state
      }

      const newAnswer: PeerReviewAnswer = {
        ...currentAnswer,
        answers: currentAnswer.answers.map(answer =>
          answer.peerReviewQuestionId === peerReviewQuestionId
            ? { ...answer, value }
            : answer,
        ),
      }

      const submitDisabled = newAnswer.answers.some(
        answer => answer.value === null,
      )

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

      const peerReviewAnswer: PeerReviewAnswer = {
        quizAnswerId,
        userId,
        peerReviewCollectionId,
        rejectedQuizAnswerIds: rejected.map(x => {
          const id = x.id
          if (!id) {
            console.log(
              "Should be impossible for received quiz answer not to have id...",
            )
            return ""
          }
          return id
        }),
        answers: questionIds.map(questionId => {
          return {
            peerReviewQuestionId: questionId,
            value: null,
          } as PeerReviewGradeAnswer
        }),
      }
      return {
        ...state,
        answer: peerReviewAnswer,
      }
    default:
      return state
  }
}

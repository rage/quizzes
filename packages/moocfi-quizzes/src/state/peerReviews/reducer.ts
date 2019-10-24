import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
} from "../../modelTypes"

export const initialState = {
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
  state: PeerReviewsState = initialState,
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
      return initialState
    case getType(peerReviews.changeGrade):
      {
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

      const submitDisabled = submitShouldBeDisabled(newAnswer)

      return {
        ...state,
        answer: newAnswer,
        submitDisabled,
      }
    }
    case getType(peerReviews.changeText):
      {
        const { peerReviewQuestionId, text } = action.payload
        const currentAnswer = state.answer
        if (!currentAnswer) {
          console.log("peer review answer is null")
          return state
        }
  
        const newAnswer: PeerReviewAnswer = {
          ...currentAnswer,
          answers: currentAnswer.answers.map(answer =>
            answer.peerReviewQuestionId === peerReviewQuestionId
              ? { ...answer, text }
              : answer,
          ),
        }
  
        const submitDisabled = submitShouldBeDisabled(newAnswer)
  
        return {
          ...state,
          answer: newAnswer,
          submitDisabled,
        }
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


const submitShouldBeDisabled = (prAnswer: PeerReviewAnswer) : boolean => {
  return prAnswer.answers.some(answer => {
    if(typeof (answer as PeerReviewGradeAnswer).value === "number"){
      return false
    }
    answer = answer as PeerReviewEssayAnswer

    return (typeof answer.text !== "string"
        // do we want to check if anything is actually written? 
        // if essay part is optional, probably shouldn't 
        || answer.text.trim().length === 0)
    
  })
}
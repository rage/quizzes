import reduceReducers from "reduce-reducers"
import { ActionType, getType } from "typesafe-actions"
import * as peerReviews from "./actions"
import { setAnswer } from "../quizAnswer/actions"
import { setQuizState } from "../user/actions"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
  PeerReviewCollection,
} from "../../modelTypes"

export const initialState: PeerReviewsState = {
  options: [],
  answer: null,
  submitDisabled: true,
  activeStep: 0,
}

export type PeerReviewsState = {
  answer: PeerReviewAnswer | null
  options: QuizAnswer[]
  submitDisabled: boolean
  activeStep: number
}

type PeerReviewActions =
  | typeof peerReviews
  | typeof setAnswer
  | typeof setQuizState

/*const activeStepReducer = (
  state: PeerReviewsState = initialState,
  action: ActionType<PeerReviewActions>,
): PeerReviewsState => {
  switch (action.type) {
    case getType(setAnswer) || getType(setQuizState):
      const quiz = action.payload.quiz
      const quizAnswer = action.payload.quizAnswer
      const userQuizState = action.payload.userQuizState

      if (quiz && quizAnswer && userQuizState) {
        const course = quiz.course
        const answerStatus = quizAnswer.status ? quizAnswer.status : null
        const answerLocked = userQuizState && userQuizState.status === "locked"
        const peerReviewsGiven = userQuizState ? userQuizState.peerReviewsGiven : 0
        const peerReviewsReceived = userQuizState
          ? userQuizState.peerReviewsReceived
          : 0
        const peerReviewsRequired = course.minPeerReviewsGiven
        const peerReviewsReceivedRequired = course.minPeerReviewsReceived

        let activeStep = 0
        if (answerLocked) {
          activeStep = 1

          if (peerReviewsGiven >= peerReviewsRequired) {
            activeStep = 2

            if (peerReviewsReceived >= peerReviewsReceivedRequired) {
              activeStep = 3
            }
          }

          if (answerStatus === "rejected" || answerStatus === "spam") {
            activeStep = 3
          }

          if (answerStatus === "confirmed") {
            activeStep = 4
          }
        }
        return { ...state, activeStep }
      } else {
        return state
      }
    default:
      return state
  }
}*/

export const peerReviewsReducer = (
  state: PeerReviewsState = initialState,
  action: ActionType<PeerReviewActions>,
): PeerReviewsState => {
  switch (action.type) {
    case getType(peerReviews.set):
      return action.payload
    case getType(peerReviews.setReviewAnswer):
      return { ...state, answer: action.payload }
    case getType(peerReviews.setReviewOptions):
      return { ...state, options: action.payload }
    case getType(peerReviews.changeActiveStep):
      return { ...state, activeStep: action.payload }
    case getType(peerReviews.clear):
      return initialState
    case getType(peerReviews.changeGradeAction): {
      const {
        peerReviewQuestionId,
        value,
        peerReviewCollection,
      } = action.payload
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

      const submitDisabled = submitShouldBeDisabled(
        newAnswer,
        peerReviewCollection,
      )

      return {
        ...state,
        answer: newAnswer,
        submitDisabled,
      }
    }
    case getType(peerReviews.changeTextAction): {
      const {
        peerReviewQuestionId,
        text,
        peerReviewCollection,
      } = action.payload
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

      const submitDisabled = submitShouldBeDisabled(
        newAnswer,
        peerReviewCollection,
      )

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
        answers: questionIds.map((questionId: string) => {
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
    case getType(setQuizState):
      const quiz = action.payload.quiz
      const quizAnswer = action.payload.quizAnswer
      const userQuizState = action.payload.userQuizState

      if (quiz && quizAnswer && userQuizState) {
        const course = quiz.course
        const answerStatus = quizAnswer.status ? quizAnswer.status : null
        const answerLocked = userQuizState && userQuizState.status === "locked"
        const peerReviewsGiven = userQuizState
          ? userQuizState.peerReviewsGiven
          : 0
        const peerReviewsReceived = userQuizState
          ? userQuizState.peerReviewsReceived
          : 0
        const peerReviewsRequired = course.minPeerReviewsGiven
        const peerReviewsReceivedRequired = course.minPeerReviewsReceived

        let activeStep = 0
        if (answerLocked) {
          activeStep = 1

          if (peerReviewsGiven >= peerReviewsRequired) {
            activeStep = 2

            if (peerReviewsReceived >= peerReviewsReceivedRequired) {
              activeStep = 3
            }
          }

          if (answerStatus === "rejected" || answerStatus === "spam") {
            activeStep = 3
          }

          if (answerStatus === "confirmed") {
            activeStep = 4
          }
        }
        return { ...state, activeStep }
      } else {
        return state
      }
    default:
      return state
  }
}

// export const peerReviewsReducer = reduceReducers(prReducer, activeStepReducer)

const submitShouldBeDisabled = (
  prAnswer: PeerReviewAnswer,
  peerReviewCollection: PeerReviewCollection,
): boolean => {
  return prAnswer.answers.some(answer => {
    const questionId = answer.peerReviewQuestionId
    const peerReviewQuestion = peerReviewCollection.questions.find(
      q => q.id === questionId,
    )

    if (!peerReviewQuestion) {
      console.log(
        "Peer review answer to question doesn't match any peer review question",
      )
      return true
    }

    const answerIsRequired = peerReviewQuestion.answerRequired

    if (!answerIsRequired) {
      return false
    }

    if (typeof (answer as PeerReviewGradeAnswer).value === "number") {
      return false
    }
    answer = answer as PeerReviewEssayAnswer
    if (typeof answer.text !== "string") {
      return true
    }

    return answerIsRequired && answer.text.trim().length === 0
  })
}

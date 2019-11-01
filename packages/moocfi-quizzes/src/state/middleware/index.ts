import { getType } from "typesafe-actions"
import * as quizAnswerActions from "../quizAnswer/actions"
import * as userQuizStateActions from "../user/actions"
import * as peerReviewActions from "../peerReviews/actions"
import { Store } from "../store"

export const activeStepManager: any = (store: Store) => (next: any) => (
  action: any,
) => {
  let quizAnswer
  let userQuizState
  if (action.type === getType(quizAnswerActions.set)) {
    quizAnswer = next(action).payload
    userQuizState = store.getState().user.userQuizState
  } else if (action.type === getType(userQuizStateActions.setQuizState)) {
    userQuizState = next(action).payload
    quizAnswer = store.getState().quizAnswer.quizAnswer
  } else {
    return next(action)
  }
  const course = store.getState().quiz!.course

  const answerStatus = quizAnswer.status ? quizAnswer.status : null
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const peerReviewsGiven = userQuizState ? userQuizState.peerReviewsGiven : 0
  const peerReviewsReceived = userQuizState
    ? userQuizState.peerReviewsReceived
    : 0
  const peerReviewsRequired = course!.minPeerReviewsGiven
  const peerReviewsReceivedRequired = course!.minPeerReviewsReceived

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
  store.dispatch(peerReviewActions.changeActiveStep(activeStep))
}

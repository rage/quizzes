import * as React from "react"
import { Stepper, StepLabel, Step } from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

const StageVisualizer = () => {
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  if (!languageInfo || !quiz) {
    return <div />
  }

  if (quizDisabled) {
    return <div style={{ display: "none" }} />
  }

  const stageLabels = languageInfo.stage

  const steps = [
    stageLabels.answerStageLabel,
    stageLabels.givingPeerReviewsStageLabel,
    stageLabels.receivingPeerReviewsStageLabel,
    stageLabels.evaluationStageLabel,
  ]

  const answerLocked = userQuizState && userQuizState.status === "locked"
  const peerReviewsGiven = userQuizState ? userQuizState.peerReviewsGiven : 0
  const peerReviewsReceived = userQuizState
    ? userQuizState.peerReviewsReceived
    : 0
  const peerReviewsRequired = quiz.course.minPeerReviewsGiven
  const peerReviewsReceivedRequired = quiz.course.minPeerReviewsReceived

  let activeStep = 0
  if (answerLocked) {
    activeStep = 1

    if (peerReviewsGiven >= peerReviewsRequired) {
      activeStep = 2

      if (peerReviewsReceived >= peerReviewsReceivedRequired) {
        activeStep = 3
      }
    }
  }

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map(label => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default StageVisualizer

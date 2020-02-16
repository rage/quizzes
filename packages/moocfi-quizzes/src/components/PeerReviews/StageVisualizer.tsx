import * as React from "react"
import { Stepper, StepLabel, Step } from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

const StageVisualizer = () => {
  const activeStep = useTypedSelector(state => state.peerReviews.activeStep)
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

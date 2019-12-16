import * as React from "react"
import {
  Stepper,
  StepIcon,
  StepLabel,
  Step,
  withStyles,
} from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

let styles = {
  root: { backgroundColor: "#f6f4f4" },
  stepIcon: { color: "#4844a3 !important" },
}

const StageVisualizer = (props: any) => {
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

  const { classes } = props

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      classes={{ root: classes.root }}
    >
      {steps.map(label => (
        <Step key={label}>
          <StepLabel
            StepIconProps={{
              classes: {
                active: classes.stepIcon,
                completed: classes.stepIcon,
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default withStyles(styles)(StageVisualizer)

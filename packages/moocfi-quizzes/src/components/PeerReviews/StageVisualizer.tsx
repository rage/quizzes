import * as React from "react"
import styled from "styled-components"
import {
  Stepper,
  StepIcon,
  StepLabel,
  Step,
  withStyles,
} from "@material-ui/core"
import { useTypedSelector } from "../../state/store"
import ThemeProviderContext from "../../contexes/themeProviderContext"

interface StyledStepperProps {
  providedStyles: string | undefined
}

const StyledStepper = styled(Stepper)<StyledStepperProps>`
  ${({ providedStyles }) => providedStyles}
`

const StageVisualizer = (props: any) => {
  const themeProvider = React.useContext(ThemeProviderContext)
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
    <StyledStepper
      activeStep={activeStep}
      alternativeLabel
      providedStyles={themeProvider.stepperStyles}
    >
      {steps.map((label, index) => (
        <Step key={label} aria-current={activeStep == index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </StyledStepper>
  )
}

export default StageVisualizer

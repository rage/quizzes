import React from "react"
import { Stepper, StepLabel, Step } from "@material-ui/core"

const steps = [
  "Tehtävään vastaaminen",
  "Vertaisarvioden antaminen",
  "Vertaisarvioden vastaanottaminen",
  "Tehtävän arvostelu",
]

const StageVisualizer = ({
  answered,
  peerReviewsGiven,
  peerReviewsRequired,
}) => {
  let activeStep = 0
  if (answered) {
    activeStep = 1

    if (peerReviewsGiven >= peerReviewsRequired) {
      activeStep = 2
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

import * as React from "react"
import { Stepper, StepLabel, Step } from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

const steps = [
  "Tehtävään vastaaminen",
  "Vertaisarvioden antaminen",
  "Vertaisarvioden vastaanottaminen",
  "Tehtävän arvostelu",
]

const StageVisualizer = () => {
  const quizAnswer = useTypedSelector(state => state.quizAnswer)

  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const quiz = useTypedSelector(state => state.quiz)

  const answered = quizAnswer.id ? true : false

  const peerReviewsGiven = userQuizState ? userQuizState.peerReviewsGiven : 0
  const peerReviewsReceived = userQuizState
    ? userQuizState.peerReviewsReceived
    : 0

  const peerReviewsRequired = quiz.course.minPeerReviewsGiven
  const peerReviewsReceivedRequired = quiz.course.minPeerReviewsReceived

  let activeStep = 0
  if (answered) {
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

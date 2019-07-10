import * as React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { SpaciousPaper } from "../styleComponents"
import { useTypedSelector } from "../../state/store"

const QuizPointsStatus = () => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

  if (!quiz || !languageInfo) {
    // should not be possible
    return <div>No quiz</div>
  }

  const generalLabels = languageInfo.general
  const quizPoints = quiz.points

  if (!userQuizState || userQuizState.status === "open") {
    return (
      <SpaciousPaper>
        <Typography variant="body1">
          {generalLabels.pointsAvailableLabel}: {quizPoints}
        </Typography>
      </SpaciousPaper>
    )
  }

  const userPoints =
    userQuizState.pointsAwarded !== null ? userQuizState.pointsAwarded : 0
  const result = Number.isInteger(userPoints)
    ? userPoints
    : userPoints.toFixed(2)
  return (
    <StyledPaper pointsRatio={userPoints / quizPoints}>
      <Typography variant="body1">
        {generalLabels.pointsReceivedLabel}: {result}
      </Typography>
      <Typography variant="body1">
        Points available in the quiz: {quizPoints}
      </Typography>
    </StyledPaper>
  )
}

const StyledPaper = styled(({ pointsRatio, ...others }) => (
  <SpaciousPaper {...others} />
))`
  color: ${({ pointsRatio }) =>
    Math.abs(1 - pointsRatio) < 0.001 ? "green" : "inherit"};
`

export default QuizPointsStatus

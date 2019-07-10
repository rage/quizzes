import * as React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { SpaciousPaper } from "../styleComponents"
import { useTypedSelector } from "../../state/store"

const QuizPointsStatus = () => {
  const answer = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)

  if (!quiz) {
    // should not be possible
    return <div>No quiz</div>
  }

  const quizPoints = quiz.points

  if (!answer) {
    return (
      <SpaciousPaper>
        <Typography variant="body1">
          Points available in the quiz: {quizPoints}
        </Typography>
      </SpaciousPaper>
    )
  }

  const userPoints = answer.pointsAwarded !== null ? answer.pointsAwarded : 0
  const result = Number.isInteger(userPoints)
    ? userPoints
    : userPoints.toFixed(2)
  return (
    <StyledPaper pointsRatio={userPoints / quizPoints}>
      <Typography variant="body1">Points awarded to you: {result}</Typography>
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

import * as React from "react"
import { Grid, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useTypedSelector } from "../../state/store"

const StyledGrid = styled(({ answered, ...others }) => <Grid {...others} />)`
  padding: 1rem;
  background-color: ${({ answered }) => (answered ? "#213094" : "#555f9e")};
`

const TopInfoBar: React.FunctionComponent = () => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

  if (!quiz || !languageInfo) {
    // should not be possible
    return <div>No quiz</div>
  }

  const title = quiz.texts[0].title
  const quizLabel = languageInfo.general.quizLabel
  const receivedPoints =
    userQuizState && userQuizState.pointsAwarded
      ? userQuizState.pointsAwarded
      : 0

  const formattedReceivedPoints = Number.isInteger(receivedPoints)
    ? receivedPoints
    : receivedPoints.toFixed(2)
  const availablePoints = quiz.points

  return (
    <StyledGrid
      answered={userQuizState && userQuizState.tries > 0}
      container={true}
      justify="space-between"
      alignItems="center"
    >
      <Grid item={true}>
        <Typography variant="h5">{quizLabel}</Typography>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid item={true}>
        <Typography variant="h4">
          {formattedReceivedPoints}/{availablePoints}
        </Typography>
      </Grid>
    </StyledGrid>
  )
}

export default TopInfoBar

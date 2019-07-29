import * as React from "react"
import { Grid, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useTypedSelector } from "../../state/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"

const StyledGrid = styled(({ answered, ...others }) => <Grid {...others} />)`
  padding: 1rem;
  color: white;
  background-color: ${({ answered }) => (answered ? "#213094" : "#555f9e")};
`

const PointsText = styled.div`
  font-size: 1.5rem;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  text-align: end;
`

const PointsLabelText = styled.div`
  font-size: 1rem;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  text-align: end;
`

const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin: 0 1.5rem 0 0.5rem;
`

const RightMarginedGrid = styled(Grid)`
  margin-right: 1.5rem;
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
  const pointsLabel = languageInfo.general.pointsLabel

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
        <Grid container={true} alignItems="center">
          <Grid item={true}>
            <IconWrapper>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </IconWrapper>
          </Grid>

          <Grid item={true}>
            <Typography variant="subtitle1">{quizLabel}:</Typography>
            <Typography variant="h5">{title}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <RightMarginedGrid item={true}>
        <PointsLabelText>{pointsLabel}:</PointsLabelText>
        <PointsText>
          {formattedReceivedPoints}/{availablePoints}
        </PointsText>
      </RightMarginedGrid>
    </StyledGrid>
  )
}

export default TopInfoBar

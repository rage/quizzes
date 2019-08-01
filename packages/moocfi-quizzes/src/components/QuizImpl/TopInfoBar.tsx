import ContentLoader from "react-content-loader"
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

interface ITopInfoBarProps {
  displayBars?: true
}

const TopInfoBar: React.FunctionComponent<ITopInfoBarProps> = ({
  displayBars,
}) => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

  let title
  let quizLabel
  let pointsLabel
  let receivedPoints
  let formattedReceivedPoints
  let availablePoints

  if (languageInfo) {
    quizLabel = languageInfo.general.quizLabel
    pointsLabel = languageInfo.general.pointsLabel
  }

  let titleReplacement
  let pointsReplacement

  if (!quiz) {
    title = ""
    formattedReceivedPoints = ""
    availablePoints = ""

    titleReplacement = displayBars ? (
      <ContentLoader
        height={40}
        width={100}
        speed={2}
        primaryColor="#ffffff"
        primaryOpacity={0.6}
        secondaryColor="#dddddd"
        secondaryOpacity={0.6}
        style={{ width: "300px", height: "31.2px" }}
      >
        <rect x="0" y="10" rx="4" ry="20" width="100" height="30" />
      </ContentLoader>
    ) : (
      <div style={{ height: "31.2px" }} />
    )

    pointsReplacement = displayBars ? (
      <ContentLoader
        height={40}
        width={100}
        speed={2}
        primaryColor="#ffffff"
        primaryOpacity={0.6}
        secondaryColor="#dddddd"
        secondaryOpacity={0.6}
        style={{ width: "45px", height: "31.2px" }}
      >
        <rect x="0" y="10" rx="25" ry="25" width="100" height="30" />
      </ContentLoader>
    ) : (
      <div style={{ height: "31.2px" }} />
    )
  } else {
    title = quiz.texts[0].title

    receivedPoints =
      userQuizState && userQuizState.pointsAwarded
        ? userQuizState.pointsAwarded
        : 0

    formattedReceivedPoints = Number.isInteger(receivedPoints)
      ? receivedPoints
      : receivedPoints.toFixed(2)
    availablePoints = quiz.points
  }

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
            {quiz ? (
              <Typography variant="h5">{title}</Typography>
            ) : (
              titleReplacement
            )}
          </Grid>
        </Grid>
      </Grid>

      <RightMarginedGrid item={true}>
        <PointsLabelText>{pointsLabel}:</PointsLabelText>
        <PointsText>
          {quiz
            ? `${formattedReceivedPoints}/${availablePoints}`
            : pointsReplacement}
        </PointsText>
      </RightMarginedGrid>
    </StyledGrid>
  )
}

export default TopInfoBar

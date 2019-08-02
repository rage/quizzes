import ContentLoader from "react-content-loader"
import * as React from "react"
import { Grid, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useTypedSelector } from "../../state/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"

const StyledGrid = styled(Grid)`
  padding: 1rem;
  color: white;
  background-color: #213094;
`

const PointsText = styled(Typography)`
  font-size: 1.5rem !important;
  text-align: end;
`

const IconAndTitleGrid = styled(Grid)`
  @media (max-width: 550px) {
    max-width: 100%;
    flex-basis: 100%;
  }
`

const PointsLabelText = styled(Typography)`
  font-size: 1rem !important;
`

const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin: 0 1.5rem 0 0.5rem;
  @media (max-width: 550px) {
    text-align: center;
  }
`

const RightMarginedGrid = styled(Grid)`
  margin-right: 1.5rem;
  text-align: end;

  @media (max-width: 550px) {
    max-width: 100%;
    flex-basis: 100%;
    text-align: left;
  }
`

const SpaceFillerDiv = styled.div`
  height: 31.2px;
`

const TopInfoBar: React.FunctionComponent = () => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const displayBars = useTypedSelector(state => state.loadingBars)

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
      <QuizTitleLoadingBar />
    ) : (
      <SpaceFillerDiv />
    )

    pointsReplacement = displayBars ? (
      <QuizPointsLoadingBar />
    ) : (
      <SpaceFillerDiv />
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
      container={true}
      justify="space-between"
      alignItems="flex-start"
    >
      <IconAndTitleGrid item={true} xs={8}>
        <Grid container={true} alignItems="center">
          <IconAndTitleGrid item={true} xs={3}>
            <IconWrapper>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </IconWrapper>
          </IconAndTitleGrid>

          <IconAndTitleGrid item={true} xs={9}>
            <Typography variant="subtitle1">{quizLabel}:</Typography>
            {quiz ? (
              <Typography variant="h5">{title}</Typography>
            ) : (
              titleReplacement
            )}
          </IconAndTitleGrid>
        </Grid>
      </IconAndTitleGrid>

      <RightMarginedGrid item={true} xs={2}>
        <PointsLabelText>{pointsLabel}:</PointsLabelText>

        {quiz ? (
          <PointsText>
            `${formattedReceivedPoints}/${availablePoints}`
          </PointsText>
        ) : (
          pointsReplacement
        )}
      </RightMarginedGrid>
    </StyledGrid>
  )
}

const QuizTitleLoadingBar = () => {
  return (
    <ContentLoader
      height={40}
      width={100}
      speed={2}
      primaryColor="#ffffff"
      primaryOpacity={0.6}
      secondaryColor="#dddddd"
      secondaryOpacity={0.6}
      style={{ width: "100%", maxWidth: "300px", height: "31.2px" }}
    >
      <rect x="0" y="10" rx="4" ry="20" width="100" height="30" />
    </ContentLoader>
  )
}

const StyledQuizTitleLoadingBar = styled(QuizTitleLoadingBar)`
  width: 100%;
  max-width: 300px;
  height: 31.2px;
`

const QuizPointsLoadingBar = () => {
  return (
    <ContentLoader
      height={40}
      width={100}
      speed={2}
      primaryColor="#ffffff"
      primaryOpacity={0.6}
      secondaryColor="#dddddd"
      secondaryOpacity={0.6}
      style={{
        width: "100%",
        maxWidth: "50px",
        height: "31.2px",
        textAlign: "end",
      }}
    >
      <rect x="0" y="10" rx="25" ry="25" width="100" height="30" />
    </ContentLoader>
  )
}

export default TopInfoBar

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
  color: white;
  display: inline;

  @media (max-width: 550px) {
    text-align: start;
  }
`

const XXS12Grid = styled(Grid)`
  @media (max-width: 550px) {
    max-width: 100%;
    flex-basis: 100%;
  }
`

const PointsLabelText = styled(Typography)`
  font-size: 1rem !important;
  color: white;

  @media (max-width: 550px) {
    text-align: start;
    margin-top: 10px;
  }
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
  height: 31.2px;

  @media (max-width: 550px) {
    max-width: 100%;
    flex-basis: 100%;
    text-align: left;
  }
`

const SpaceFillerDiv = styled.div`
  height: 31.2px;
`

interface ITopInfoBarProps {
  // when the user is not logged in
  staticBars?: boolean
}

const TopInfoBar: React.FunctionComponent<ITopInfoBarProps> = ({
  staticBars,
}) => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const loggedIn = !!useTypedSelector(state => state.user.accessToken)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const displayBars = useTypedSelector(state => state.loadingBars)
  const showPointsInfo = useTypedSelector(
    state => state.customization.showPointsInfo,
  )

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
  let pointsPortion

  if (!quiz) {
    title = ""
    formattedReceivedPoints = ""
    availablePoints = ""

    titleReplacement =
      displayBars || staticBars ? (
        <QuizTitleLoadingBar animate={!staticBars} />
      ) : (
        <SpaceFillerDiv />
      )

    pointsPortion =
      displayBars || staticBars ? (
        <QuizPointsLoadingBar animate={!staticBars} />
      ) : (
        <SpaceFillerDiv />
      )
  } else {
    title = quiz.texts[0].title
    availablePoints = quiz.points

    if (loggedIn) {
      receivedPoints =
        userQuizState && userQuizState.pointsAwarded
          ? userQuizState.pointsAwarded
          : 0

      formattedReceivedPoints = Number.isInteger(receivedPoints)
        ? receivedPoints
        : receivedPoints.toFixed(2)

      pointsPortion = (
        <PointsText component="div" paragraph={false}>
          {`${formattedReceivedPoints}/${availablePoints}`}
        </PointsText>
      )
    } else {
      pointsPortion = (
        <>
          <StyledShortPointContentLoader
            animate={false}
            height={30}
            width={30}
            primaryColor="#ffffff"
            primaryOpacity={0.6}
            secondaryColor="#dddddd"
            secondaryOpacity={0.6}
          >
            <rect x="0" y="5" rx="10" ry="10" width="30" height="25" />
          </StyledShortPointContentLoader>

          <PointsText component="div" paragraph={false}>
            {`/${availablePoints}`}
          </PointsText>
        </>
      )
    }
  }

  return (
    <StyledGrid
      container={true}
      justify="space-between"
      alignItems="flex-start"
    >
      <XXS12Grid item={true} xs={9}>
        <Grid container={true} alignItems="stretch">
          <XXS12Grid item={true} xs={3} md={2}>
            <IconWrapper>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </IconWrapper>
          </XXS12Grid>

          <XXS12Grid item={true} xs={9} md={10}>
            <Typography variant="subtitle1">{quizLabel}:</Typography>
            {quiz ? (
              <Typography variant="h5">{title}</Typography>
            ) : (
              titleReplacement
            )}
          </XXS12Grid>
        </Grid>
      </XXS12Grid>

      {(!quiz || showPointsInfo) && (
        <RightMarginedGrid item={true} xs={2}>
          <PointsLabelText component="div" paragraph={false}>
            {pointsLabel}:
          </PointsLabelText>
          {pointsPortion}
        </RightMarginedGrid>
      )}
    </StyledGrid>
  )
}

interface ILoadingBarProps {
  animate: boolean
}

const QuizTitleLoadingBar: React.FunctionComponent<ILoadingBarProps> = ({
  animate,
}) => {
  return (
    <StyledQuizTitleContentLoader
      animate={animate}
      height={40}
      width={100}
      speed={2}
      primaryColor="#ffffff"
      primaryOpacity={0.6}
      secondaryColor="#dddddd"
      secondaryOpacity={0.6}
    >
      <rect x="0" y="10" rx="4" ry="20" width="100" height="30" />
    </StyledQuizTitleContentLoader>
  )
}

const StyledQuizTitleContentLoader = styled(ContentLoader)`
  width: 100%;
  max-width: 300px;
  height: 31.2px;
`

const QuizPointsLoadingBar: React.FunctionComponent<ILoadingBarProps> = ({
  animate,
}) => {
  return (
    <StyledQuizPointsContentLoader
      animate={animate}
      height={40}
      width={100}
      speed={2}
      primaryColor="#ffffff"
      primaryOpacity={0.6}
      secondaryColor="#dddddd"
      secondaryOpacity={0.6}
    >
      <rect x="0" y="10" rx="25" ry="25" width="100" height="30" />
    </StyledQuizPointsContentLoader>
  )
}

const StyledQuizPointsContentLoader = styled(ContentLoader)`
  width: 100%;
  max-width: 45px;
  height: 31.2px;
`

const StyledShortPointContentLoader = styled(ContentLoader)`
  max-width: 35px;
  position: relative;
  top: 5px;
  height: 31.2px;
`

export default TopInfoBar

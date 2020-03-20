import ContentLoader from "react-content-loader"
import * as React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { useTypedSelector } from "../../state/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import ThemeProviderContext from "../../contexes/themeProviderContext"

export interface TopInfoBarContainerProps {
  loggedIn?: boolean
  answered?: boolean
  confirmed?: boolean
  rejected?: boolean
}

const Container = styled.div<TopInfoBarContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
  color: white;
  background-color: #213094;
`

const IconContainer = styled.div`
  margin-right: 1rem;
  font-size: 3.5rem;
`

const TitleContainer = styled.div`
  margin-right: auto;
`

const PointsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const QuizStatusMessage = styled(Typography)``

const PointsText = styled(Typography)`
  font-size: 1.5rem !important;
  text-align: end;
  display: inline;
  max-height: 100%;

  @media (max-width: 550px) {
    text-align: start;
  }
`

const PointsLabelText = styled(Typography)`
  font-size: 1rem !important;

  @media (max-width: 550px) {
    text-align: start;
    margin-top: 10px;
  }
`

const SpaceFillerDiv = styled.div`
  max-height: 31.2px;
`

interface ITopInfoBarProps {
  // when the user is not logged in
  staticBars?: boolean
}

const TopInfoBar: React.FunctionComponent<ITopInfoBarProps> = ({
  staticBars,
}) => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const loggedIn = !!useTypedSelector(state => state.user.accessToken)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const displayBars = useTypedSelector(state => state.loadingBars)

  let title
  let quizLabel
  let answeredLabel
  let unansweredLabel
  let rejectedLabel
  let pointsLabel
  let receivedPoints
  let formattedReceivedPoints
  let availablePoints

  if (languageInfo) {
    quizLabel = languageInfo.general.quizLabel
    pointsLabel = languageInfo.general.pointsLabel
    answeredLabel = languageInfo.general.answered
    unansweredLabel = languageInfo.general.unanswered
    rejectedLabel = languageInfo.general.rejected
  }

  const answerStatus = quizAnswer.status
  const status = answerStatus
    ? answerStatus !== "rejected" && answerStatus !== "spam"
      ? "answered"
      : "rejected"
    : ""
  const statusLabel = status
    ? status === "rejected"
      ? rejectedLabel
      : answeredLabel
    : unansweredLabel

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
        <div style={{ height: "31.2px" }}>
          <StyledShortPointContentLoader
            animate={false}
            height={25}
            width={30}
            primaryColor="#ffffff"
            primaryOpacity={0.6}
            secondaryColor="#dddddd"
            secondaryOpacity={0.6}
          >
            <rect x="0" y="0" rx="10" ry="10" width="30" height="25" />
          </StyledShortPointContentLoader>

          <PointsText component="div" paragraph={false}>
            {`/${availablePoints}`}
          </PointsText>
        </div>
      )
    }
  }

  const ProvidedIcon = themeProvider.topInfoBarIcon
  const TopInfoBarContainer = themeProvider.topInfoBarContainer || Container

  return (
    <TopInfoBarContainer loggedIn={loggedIn}>
      <IconContainer>
        {ProvidedIcon ? (
          <>
            <ProvidedIcon status={status} />
            <QuizStatusMessage className={status} variant="subtitle1">
              {statusLabel}
            </QuizStatusMessage>
          </>
        ) : (
          <FontAwesomeIcon icon={faQuestionCircle} />
        )}
      </IconContainer>
      <TitleContainer>
        <Typography component="p" variant="subtitle1" id="quiz-type-label">
          {quizLabel}:
        </Typography>
        {quiz ? (
          <Typography
            variant="h5"
            component="h2"
            aria-describedby="quiz-type-label"
          >
            {title}
          </Typography>
        ) : (
          titleReplacement
        )}
      </TitleContainer>
      {(!quiz || !quiz.excludedFromScore) && (
        <PointsContainer>
          <PointsLabelText component="div" paragraph={false}>
            {pointsLabel}:
          </PointsLabelText>
          {pointsPortion}
        </PointsContainer>
      )}
    </TopInfoBarContainer>
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
  max-height: 31.2px;
  vertical-align: top;
  position: relative;
  top: 5px;
`

export default TopInfoBar

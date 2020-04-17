import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Grid, Typography } from "@material-ui/core"
import * as quizAnswerActions from "../../state/quizAnswer/actions"
import * as messageActions from "../../state/message/actions"

import { initialize } from "../../state/actions"
import Checkbox from "../CheckboxOption"
import Feedback from "../Feedback"
import MultipleChoice from "../MultipleChoice"
import ResearchAgreement from "../ResearchAgreement"
import Scale from "../Scale"
import Open from "../Open"
import Essay from "../Essay"
import StageVisualizer from "../PeerReviews/StageVisualizer"
import PeerReviews from "../PeerReviews"
import Unsupported from "../Unsupported"
import ResultInformation from "./ResultInformation"
import { useTypedSelector } from "../../state/store"
import { Quiz, QuizItemType } from "../../modelTypes"

import Deadline from "./Deadline"
import LoadingQuiz from "./LoadingQuiz"
import TopInfoBar from "./TopInfoBar"
import SubmitButton from "./SubmitButton"
import LoginPrompt from "./LoginPrompt"
import MarkdownText from "../MarkdownText"
import { BoldTypography } from "../styleComponents"

const componentsByTypeNames = (typeName: QuizItemType) => {
  const mapTypeToComponent = {
    essay: Essay,
    "multiple-choice": MultipleChoice,
    scale: Scale,
    checkbox: Checkbox,
    open: Open,
    "research-agreement": ResearchAgreement,
    feedback: Feedback,
    "custom-frontend-accept-data": Unsupported,
  }

  return mapTypeToComponent[typeName]
}

export interface QuizProps {
  id: string
  languageId: string
  accessToken: string
  backendAddress?: string
  customContent?: Element | JSX.Element
  fullInfoWithoutLogin?: boolean
  showZeroPointsInfo?: boolean
}

const QuizItemContainerDiv = styled.div`
  padding-bottom: 20px;
`

interface IComponentWrapperProps {
  rowNumber: number
}

const ComponentWrapper = styled.div<IComponentWrapperProps>`
  background-color: ${props =>
    props.rowNumber % 2 === 0 ? "inherit" : "#605c980d"};
  border-radius: 10px;
  padding: 1rem 2rem 1rem 1rem;
`

interface IQuizContentWrapperProps {
  disabled: boolean
}

const QuizContentWrapper = styled.div<IQuizContentWrapperProps>`
  padding: 1rem;
  ${({ disabled }) =>
    disabled &&
    `
        opacity: 0.6;
        cursor: default;
      `}
`

const OuterDiv = styled.div`
  p {
    margin-bottom: 0 !important;
  }
  ul {
    padding-inline-start: 30px;
  }
`

const FuncQuizImpl: React.FunctionComponent<QuizProps> = ({
  id,
  languageId,
  accessToken,
  backendAddress,
  customContent,
  fullInfoWithoutLogin,
  showZeroPointsInfo = true,
}) => {
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const pastDeadline = useTypedSelector(state => state.quizAnswer.pastDeadline)
  const messageState = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const storeAccessToken = useTypedSelector(state => state.user.accessToken)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)
  const showPoints = useTypedSelector(
    state => state.customization.showPointsInfo,
  )
  const activeStep = useTypedSelector(state => state.peerReviews.activeStep)

  const dispatch = useDispatch()

  const error = messageState.errorMessage

  useEffect(() => {
    dispatch(
      initialize(
        id,
        languageId,
        accessToken,
        backendAddress,
        fullInfoWithoutLogin,
        showZeroPointsInfo,
      ),
    )
  }, [id, languageId, accessToken, backendAddress])

  if (!accessToken && !fullInfoWithoutLogin) {
    return (
      <div>
        <TopInfoBar staticBars />
        <LoginPrompt content={customContent} />
      </div>
    )
  }

  const loggedInButNotSetInStore = accessToken && !storeAccessToken

  if (loggedInButNotSetInStore || !quiz) {
    return <LoadingQuiz content={customContent} accessToken={accessToken} />
  }
  if (!languageInfo) {
    return <div>language info not set</div>
  }

  const generalLabels = languageInfo.general

  const quizItemComponents = (quiz: Quiz, languageId: string) => {
    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map((item, idx) => {
            const ItemComponent = componentsByTypeNames(item.type)
            return (
              <ComponentWrapper rowNumber={idx} key={item.id}>
                <ItemComponent item={item} />
              </ComponentWrapper>
            )
          })}
      </>
    )
  }

  if (error) {
    return (
      <div>
        {generalLabels && generalLabels.errorLabel}
        <pre>{error}</pre>
      </div>
    )
  }

  if (quiz.texts.length === 0) {
    const message =
      "Error: quiz has no texts. (Likely the quiz does not match the requested " +
      "language id)"
    dispatch(messageActions.setErrorMessage(message))
    return <div />
  }

  let triesRemaining = quiz.tries

  let stillSubmittable = true

  if (quiz.triesLimited) {
    let triesUsed = 0
    if (userQuizState) {
      triesUsed = userQuizState.tries
    }
    triesRemaining -= triesUsed
    if (triesRemaining <= 0) {
      stillSubmittable = false
    }
  }

  let locked = false
  if (userQuizState) {
    locked = userQuizState.status === "locked"
  }

  if (locked || quizDisabled) {
    stillSubmittable = false
  }

  const containsPeerReviews =
    quiz.peerReviewCollections !== null && quiz.peerReviewCollections.length > 0

  const answerStatus = quizAnswer.status ? quizAnswer.status : null

  const shouldShowPeerReviews = userQuizState
    ? userQuizState.status === "locked"
      ? answerStatus === "rejected" || answerStatus === "spam"
        ? false
        : true
      : false
    : false

  const exerciseFinishedMessage =
    activeStep === 4
      ? languageInfo.peerReviews.answerConfirmed
      : activeStep === 3
      ? answerStatus === "submitted" ||
        answerStatus === "enough-received-but-not-given"
        ? languageInfo.peerReviews.manualReview
        : answerStatus === "rejected"
        ? languageInfo.peerReviews.answerRejected
        : answerStatus === "spam"
        ? languageInfo.peerReviews.answerFlaggedAsSpam
        : null
      : null

  const showPointsPolicyLabel =
    !quiz.awardPointsEvenIfWrong &&
    quiz.items.length > 1 &&
    showPoints &&
    quiz.items.some(
      qi =>
        qi.type !== "checkbox" &&
        qi.type !== "scale" &&
        qi.type !== "feedback" &&
        qi.type !== "research-agreement",
    )

  return (
    <OuterDiv>
      <TopInfoBar />

      {quizDisabled && (
        <LoginPrompt content={customContent} fullQuizInfoShown={true} />
      )}

      <QuizContentWrapper disabled={quizDisabled}>
        <Deadline deadline={quiz.deadline} />

        {containsPeerReviews && <StageVisualizer />}

        <MarkdownText>{quiz.texts[0].body}</MarkdownText>
        <QuizItemContainerDiv>
          {quizItemComponents(quiz, languageId)}
        </QuizItemContainerDiv>

        {!stillSubmittable && !quizDisabled ? (
          <>
            {containsPeerReviews && exerciseFinishedMessage && (
              <BoldTypography>{exerciseFinishedMessage}</BoldTypography>
            )}

            {containsPeerReviews && shouldShowPeerReviews && <PeerReviews />}

            <ResultInformation
              quiz={quiz}
              quizAnswer={quizAnswer}
              generalLabels={generalLabels}
            />
          </>
        ) : (
          <div>
            {messageState.notification && messageState.notification.message && (
              <Typography
                style={{
                  color: messageState.notification.color,
                  fontSize: "1.25rem",
                }}
              >
                {messageState.notification.message}
              </Typography>
            )}

            <Grid container={true} alignItems="center" spacing={2}>
              <Grid
                item={true}
                onClick={e => {
                  if ((submitLocked || pastDeadline) && !quizDisabled) {
                    dispatch(quizAnswerActions.noticeDisabledSubmitAttempt())
                  }
                }}
                xs="auto"
              >
                <SubmitButton />
              </Grid>

              {!quizDisabled && (
                <Grid item={true} xs="auto">
                  {pastDeadline ? (
                    <Typography>{generalLabels.pastDeadline}</Typography>
                  ) : (
                    <React.Fragment>
                      <Typography>
                        {quiz.triesLimited
                          ? `${generalLabels.triesRemainingLabel}: ${triesRemaining}`
                          : generalLabels.triesNotLimitedLabel}
                      </Typography>
                      {showPointsPolicyLabel && (
                        <Typography>
                          {generalLabels.pointsGrantingPolicyInformer(
                            quiz.grantPointsPolicy,
                          )}
                        </Typography>
                      )}
                    </React.Fragment>
                  )}
                </Grid>
              )}
            </Grid>
          </div>
        )}
      </QuizContentWrapper>
    </OuterDiv>
  )
}

export default FuncQuizImpl

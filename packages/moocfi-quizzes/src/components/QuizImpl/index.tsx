import * as React from "react"
import { useContext, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import * as quizAnswerActions from "../../state/quizAnswer/actions"
import * as messageActions from "../../state/message/actions"

import { initialize } from "../../state/actions"
import { updateQuizState } from "../../state/user/actions"
import Checkbox from "../CheckboxOption"
import Feedback from "../Feedback"
import MultipleChoice from "../MultipleChoice"
import ResearchAgreement from "../ResearchAgreement"
import Scale from "../Scale"
import Open from "../Open"
import Essay from "../Essay"
import ClickableMultipleChoice from "../ClickableMultipleChoice"
import MultipleChoiceDropdown from "../MultipleChoiceDropdown"
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
import SimpleErrorBoundary from "./SimpleErrorBoundary"
import { BoldTypographyMedium } from "../styleComponents"

import ThemeProviderContext from "../../contexes/themeProviderContext"
import { CourseStatusProviderContext } from "../../contexes/courseStatusProviderContext"

import { requestReviews } from "../../state/receivedReviews/actions"

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
    "multiple-choice-dropdown": MultipleChoiceDropdown,
    "clickable-multiple-choice": ClickableMultipleChoice,
  }

  return mapTypeToComponent[typeName]
}

export interface QuizProps {
  id: string
  languageId: string
  accessToken: string
  backendAddress?: string
  customContent?: CustomContent
  fullInfoWithoutLogin?: boolean
  showZeroPointsInfo?: boolean
  alternativeQuizLabel?: string
}

export type CustomContent = {
  Login: Element | JSX.Element
  Loading: Element | JSX.Element
  WrongLocale: Element | JSX.Element
}

const QuizItemContainerDiv = styled.div`
  padding-bottom: 20px;
`

export interface IItemWrapperProps {
  rowNumber: number
}

const ItemWrapper = styled.div<IItemWrapperProps>`
  background-color: ${({ rowNumber }) =>
    rowNumber % 2 === 0 ? "inherit" : "#605c980d"};
  border-radius: 10px;
  padding: 0.7rem 2rem 1rem 1rem;
`

export interface QuizContentProps {
  disabled: boolean
}

const QuizContent = styled.div<QuizContentProps>`
  margin-top: 1.5rem;
  padding: 1rem;
  ${({ disabled }) =>
    disabled &&
    `
        opacity: 0.6;
        cursor: default;
      `}
`

interface UpperContentProps {
  providedStyles: string | undefined
}

const UpperContent = styled.div<UpperContentProps>`
  padding: 0 1rem;
  ${({ providedStyles }) => providedStyles}
`

export interface LowerContentProps {
  nItems: number
}

const LowerContent = styled.div<LowerContentProps>`
  margin-bottom: 1rem;
  padding-left: 1rem;
`

interface MessageGroupProps {
  providedStyles: string | undefined
}

const MessageGroup = styled.div<MessageGroupProps>`
  ${({ providedStyles }) => providedStyles}
`

interface SubmitGroupProps {
  providedStyles: string | undefined
}

const SubmitGroup = styled.div<SubmitGroupProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  > :last-child {
    margin-left: 1rem;
  }
  ${({ providedStyles }) => providedStyles}
`

const OuterDiv = styled.div<{ providedStyles: string | undefined }>`
  ul {
    padding-inline-start: 30px;
  }
  ${({ providedStyles }) => providedStyles}
`

interface QuizBodyProps {
  providedStyles: string | undefined
}

const QuizBody = styled(MarkdownText)<QuizBodyProps>`
  ${({ providedStyles }) => providedStyles}
`
interface SubmitMessageProps {
  providedStyles: string | undefined
}

const SubmitMessage = styled.div<SubmitMessageProps>`
  border-left: 6px solid #047500;
  padding: 0.25rem 0 0 1rem;
  margin: 0 0 3rem 0;
  p {
    margin: 1rem 0px !important;
  }
  ${({ providedStyles }) => providedStyles}
`

const ErrorMessage = styled.div`
  display: flex;
  width: auto;
  padding: 4rem;
  p {
    font-size: 2rem;
    margin: auto;
  }
`

const FuncQuizImpl: React.FunctionComponent<QuizProps> = ({
  id,
  languageId,
  accessToken,
  backendAddress,
  customContent,
  fullInfoWithoutLogin,
  showZeroPointsInfo = false,
  children,
  alternativeQuizLabel,
}) => {
  const ref = useRef(null)
  const themeProvider = useContext(ThemeProviderContext)
  const courseStatusProvider = useContext(CourseStatusProviderContext)
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

  const fatal = messageState.fatal
  const error = messageState.error

  useEffect(() => {
    if (accessToken) {
      dispatch(quizAnswerActions.setQuizDisabled(false))
    }
  })

  if (fatal) {
    console.log("quiz")
    courseStatusProvider.notifyError &&
      courseStatusProvider.notifyError(messageState.message)
    return (
      <ErrorMessage>
        <p>{messageState.message}</p>
      </ErrorMessage>
    )
  }

  if (error) {
    courseStatusProvider.notifyError &&
      courseStatusProvider.notifyError(messageState.message)
  }

  const CustomLogin = customContent && customContent.Login

  if (!accessToken && !fullInfoWithoutLogin) {
    return (
      <div>
        <TopInfoBar staticBars />
        <LoginPrompt content={CustomLogin} />
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

  if (
    courseStatusProvider.updateQuiz &&
    courseStatusProvider.updateQuiz[quiz.id]
  ) {
    dispatch(updateQuizState())
    dispatch(requestReviews())
    courseStatusProvider.quizUpdated &&
      courseStatusProvider.quizUpdated(quiz.id)
  }

  const generalLabels = languageInfo.general

  const quizItemComponents = (quiz: Quiz, languageId: string) => {
    const StyledWrapper = themeProvider.itemWrapper || ItemWrapper

    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map((item, idx) => {
            const ItemComponent = componentsByTypeNames(item.type)
            return (
              <StyledWrapper rowNumber={idx} key={item.id}>
                <ItemComponent item={item} />
              </StyledWrapper>
            )
          })}
      </>
    )
  }

  /*if (quiz.texts.length === 0) {
    const message =
      "Error: quiz has no texts. (Likely the quiz does not match the requested " +
      "language id)"
    dispatch(messageActions.errorOccurred(message))
    return <div />
  }*/

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

  const containsPeerReviews = quiz.peerReviewCollections?.length > 0

  const answerStatus = quizAnswer.status ? quizAnswer.status : null

  const shouldShowPeerReviews = userQuizState
    ? userQuizState.status === "locked"
      ? answerStatus === "rejected" || answerStatus === "spam"
        ? false
        : true
      : false
    : false

  const submitMessage = quiz.submitMessage

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

  const QuizContentWrapper = themeProvider.quizContent || QuizContent
  const LowerContentWrapper = themeProvider.lowerContent || LowerContent

  const wrongLocale = !!(customContent && customContent.WrongLocale)

  return (
    <OuterDiv
      providedStyles={themeProvider.mainDivStyles}
      aria-label={quiz.title}
      role="form"
    >
      <TopInfoBar alternativeQuizLabel={alternativeQuizLabel} />
      <div ref={ref} />
      {/*<Notification scrollRef={ref} />*/}
      <QuizContentWrapper disabled={quizDisabled || wrongLocale}>
        <UpperContent providedStyles={themeProvider.upperContentStyles}>
          <Deadline deadline={quiz.deadline} />

          {containsPeerReviews && <StageVisualizer />}

          <QuizBody providedStyles={themeProvider.quizBodyStyles}>
            {quiz.body}
          </QuizBody>
          {children}
        </UpperContent>
        <QuizItemContainerDiv>
          {quizItemComponents(quiz, languageId)}
        </QuizItemContainerDiv>
        <LowerContentWrapper nItems={quiz.items.length}>
          {!stillSubmittable && !quizDisabled ? (
            <MessageGroup providedStyles={themeProvider.messageGroupStyles}>
              {submitMessage && (
                <>
                  <SubmitMessage
                    providedStyles={themeProvider.submitMessageDivStyles}
                  >
                    <Typography>
                      {languageInfo.essay.exampleAnswerLabel}
                    </Typography>
                    <div>
                      <MarkdownText>{submitMessage}</MarkdownText>
                    </div>
                  </SubmitMessage>
                </>
              )}

              {containsPeerReviews && exerciseFinishedMessage && (
                <BoldTypographyMedium>
                  {exerciseFinishedMessage}
                </BoldTypographyMedium>
              )}

              {containsPeerReviews && shouldShowPeerReviews && <PeerReviews />}

              <ResultInformation
                quiz={quiz}
                quizAnswer={quizAnswer}
                generalLabels={generalLabels}
              />
            </MessageGroup>
          ) : (
            <>
              <SubmitGroup providedStyles={themeProvider.submitGroupStyles}>
                <div />
                <div
                  onClick={e => {
                    if ((submitLocked || pastDeadline) && !quizDisabled) {
                      dispatch(quizAnswerActions.noticeDisabledSubmitAttempt())
                    }
                  }}
                >
                  <SubmitButton />
                </div>

                {!quizDisabled && (
                  <div>
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
                  </div>
                )}
              </SubmitGroup>
            </>
          )}
        </LowerContentWrapper>
      </QuizContentWrapper>
      {customContent && customContent.WrongLocale}
      {quizDisabled && (
        <LoginPrompt
          content={customContent && customContent.Login}
          fullQuizInfoShown={true}
        />
      )}
    </OuterDiv>
  )
}

export default (props: QuizProps) => (
  <SimpleErrorBoundary>
    <FuncQuizImpl {...props} />
  </SimpleErrorBoundary>
)

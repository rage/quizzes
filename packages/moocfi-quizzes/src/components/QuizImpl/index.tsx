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

import LoadingQuiz from "./LoadingQuiz"
import TopInfoBar from "./TopInfoBar"
import SubmitButton from "./SubmitButton"
import LoginPrompt from "./LoginPrompt"
import MarkdownText from "../MarkdownText"

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
        opacity: 0.5;
        cursor: default;
      `}
`

const FuncQuizImpl: React.FunctionComponent<QuizProps> = ({
  id,
  languageId,
  accessToken,
  backendAddress,
  customContent,
  fullInfoWithoutLogin,
}) => {
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const messageState = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const dispatch = useDispatch()

  const error = messageState.errorMessage

  useEffect(
    () => {
      dispatch(
        initialize(
          id,
          languageId,
          accessToken,
          backendAddress,
          fullInfoWithoutLogin,
        ),
      )
    },
    [id, languageId, accessToken, backendAddress],
  )
  if (!quiz || !languageInfo) {
    return <LoadingQuiz />
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

  if (!fullInfoWithoutLogin) {
    return (
      <div>
        <TopInfoBar />
        <LoginPrompt content={customContent} />
      </div>
    )
  }

  return (
    <div>
      <TopInfoBar />

      {quizDisabled && <LoginPrompt content={customContent} />}

      <QuizContentWrapper disabled={quizDisabled}>
        {containsPeerReviews && <StageVisualizer />}

        <MarkdownText>{quiz.texts[0].body}</MarkdownText>

        <QuizItemContainerDiv>
          {quizItemComponents(quiz, languageId)}
        </QuizItemContainerDiv>

        {!stillSubmittable ? (
          <>
            {containsPeerReviews && <PeerReviews />}

            <ResultInformation
              quiz={quiz}
              quizAnswer={quizAnswer}
              generalLabels={generalLabels}
            />
          </>
        ) : (
          <div>
            {messageState.notification && messageState.notification.message && (
              <Typography style={{ color: messageState.notification.color }}>
                {messageState.notification.message}
              </Typography>
            )}

            <Grid container={true} alignItems="center" spacing={2}>
              <Grid
                item={true}
                onClick={e => {
                  if (submitLocked && !quizDisabled) {
                    dispatch(quizAnswerActions.noticeDisabledSubmitAttempt())
                  }
                }}
              >
                <SubmitButton />
              </Grid>

              {!quizDisabled && (
                <Grid item={true}>
                  <Typography>
                    {quiz.triesLimited
                      ? `${
                          generalLabels.triesRemainingLabel
                        }: ${triesRemaining}`
                      : generalLabels.triesNotLimitedLabel}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
        )}
      </QuizContentWrapper>
    </div>
  )
}

export default FuncQuizImpl

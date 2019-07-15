import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
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
import QuizPointsStatus from "./QuizPointsStatus"
import ResultInformation from "./ResultInformation"
import { useTypedSelector } from "../../state/store"
import { SpaciousTypography } from "../styleComponents"
import { Quiz, QuizItemType } from "../../modelTypes"

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
}

const FuncQuizImpl: React.FunctionComponent<QuizProps> = ({
  id,
  languageId,
  accessToken,
}) => {
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const messageState = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const dispatch = useDispatch()

  const error = messageState.errorMessage

  useEffect(() => {
    dispatch(initialize(id, languageId, accessToken))
  }, [])

  if (!quiz || !languageInfo || !quizAnswer) {
    return (
      <Grid container={true} justify="center">
        <Grid item={true}>
          <CircularProgress disableShrink={true} />
        </Grid>
      </Grid>
    )
  }

  const generalLabels = languageInfo.general

  const handleSubmit = () => dispatch(quizAnswerActions.submit())

  const quizContainsEssay = () => {
    return quiz.items.some(ia => ia.type === "essay")
  }

  const quizItemComponents = (quiz: Quiz, languageId: string) => {
    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map(item => {
            const ItemComponent = componentsByTypeNames(item.type)
            return <ItemComponent item={item} key={item.id} />
          })}
      </>
    )
  }

  if (!accessToken) {
    return <div>{generalLabels.loginPromptLabel}</div>
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

  if (locked) {
    stillSubmittable = false
  }

  return (
    <div>
      <Grid container={true} justify="space-between">
        <Grid item={true} xs={12} md={6}>
          <SpaciousTypography variant="h5">
            {quiz.texts[0].title}
          </SpaciousTypography>
          <SpaciousTypography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }}
          />
        </Grid>

        <Grid item={true} xs="auto">
          <QuizPointsStatus />
        </Grid>
      </Grid>
      <div>
        {quizContainsEssay() && <StageVisualizer />}

        {quizItemComponents(quiz, languageId)}

        {!stillSubmittable ? (
          <>
            {quizContainsEssay() && <PeerReviews />}

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

            <Typography>
              {quiz.triesLimited
                ? `${generalLabels.triesRemainingLabel}: ${triesRemaining}`
                : ""}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={submitLocked}
              onClick={handleSubmit}
            >
              {generalLabels.submitButtonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncQuizImpl

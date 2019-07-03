import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { initialize } from "../state/actions"
import Checkbox from "./CheckboxOption"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import Essay from "./Essay"
import StageVisualizer from "./Essay/StageVisualizer"
import PeerReviews from "./Essay/PeerReviews"
import Unsupported from "./Unsupported"
import { useTypedSelector } from "../state/store"
import { SpaciousTypography } from "./styleComponents"
import { Quiz, QuizItemType } from "../modelTypes"

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

export interface Props {
  id: string
  languageId: string
  accessToken: string
  baseUrl: string
}

const FuncQuizImpl: React.FunctionComponent<Props> = ({
  id,
  languageId,
  accessToken,
}) => {
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const error = useTypedSelector(state => state.message)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const quiz = useTypedSelector(state => state.quiz)
  const languageState = useTypedSelector(state => state.language)

  let languageInfo

  if (languageState.languageLabels) {
    languageInfo = languageState.languageLabels.general
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialize(id, languageId, accessToken))
  }, [])

  const handleSubmit = () => dispatch(quizAnswerActions.submit())

  // not all quizzess have correct solutions - e.g. self-evaluation
  const hasCorrectAnswer = quiz => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  const atLeastOneCorrect = itemAnswers =>
    itemAnswers.some(ia => ia.correct === true)

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
    return <div>{languageInfo.loginPromptLabel}</div>
  }

  if (error) {
    return (
      <div>
        {languageInfo.errorLabel}
        <pre>{error}</pre>
      </div>
    )
  }

  if (!quizAnswer || !quiz) {
    return (
      <Grid container={true} justify="center">
        <Grid item={true}>
          <CircularProgress disableShrink={true} />
        </Grid>
      </Grid>
    )
  }

  // should not be a separate case!
  // and also never occur, unless the requested language does not
  // match the language of the quiz...
  if (quiz.texts.length === 0) {
    return (
      <div>
        Error: quiz has no texts. (Likely the quiz does not match the requested
        language id)
      </div>
    )
  }

  const types = quiz.items.map(item => item.type)

  return (
    <div>
      <SpaciousTypography variant="h5">
        {quiz.texts[0].title}
      </SpaciousTypography>
      <SpaciousTypography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }}
      />

      <div>
        {quizContainsEssay() && <StageVisualizer />}

        {quizItemComponents(quiz, languageId)}

        {quizAnswer.id ? (
          <>
            {quizContainsEssay() && <PeerReviews />}

            <Typography variant="h5">
              {hasCorrectAnswer(quiz)
                ? atLeastOneCorrect(quizAnswer.itemAnswers)
                  ? quiz.items.length === 1
                    ? languageInfo.answerCorrectLabel
                    : languageInfo.kOutOfNCorrect(
                        quizAnswer.itemAnswers.filter(ia => ia.correct === true)
                          .length,
                        quiz.items.length,
                      )
                  : types.includes("essay") || types.includes("scale")
                  ? ""
                  : languageInfo.answerIncorrectLabel
                : languageInfo.alreadyAnsweredLabel}
            </Typography>
          </>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitLocked}
              onClick={handleSubmit}
            >
              {languageInfo.submitButtonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncQuizImpl

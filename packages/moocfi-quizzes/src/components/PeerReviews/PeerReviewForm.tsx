import * as React from "react"
import { useDispatch } from "react-redux"
import LikertScale from "likert-react"
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"
import MarkdownText from "../MarkdownText"
import PeerReviewOption from "./PeerReviewOption"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import { useTypedSelector } from "../../state/store"
import { PeerReviewLabels } from "../../utils/languages"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewQuestion,
  PeerReviewEssayAnswer,
  PeerReviewGradeAnswer,
  PeerReviewQuestionText,
  MiscEvent,
} from "../../modelTypes"
import { SpaciousTypography, StyledButton } from "../styleComponents"
import styled from "styled-components"

type PeerReviewFormProps = {
  languageInfo: PeerReviewLabels
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  languageInfo,
}) => {
  const answersToReview = useTypedSelector(state => state.peerReviews.options)
  const peerReview = useTypedSelector(state => state.peerReviews.answer)
  const currentAnswersToReview = peerReview
    ? answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
    : answersToReview

  if (!currentAnswersToReview) {
    return (
      <Grid container>
        <Grid item xs={1}>
          <CircularProgress size={25} />
        </Grid>
        <Grid item>
          <Typography>{languageInfo.loadingLabel}</Typography>
        </Grid>
      </Grid>
    )
  }

  if (currentAnswersToReview.length === 0) {
    return <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
  }

  const chosenStyle = { fontSize: "1.5rem", fontStyle: "bold" }

  return (
    <>
      <Typography variant="subtitle1" style={chosenStyle}>
        {peerReview
          ? languageInfo.chosenEssayInstruction
          : languageInfo.chooseEssayInstruction}
      </Typography>

      {currentAnswersToReview.map(answer => (
        <div key={answer.id}>
          <PeerReviewOption answer={answer} />

          {peerReview ? (
            <PeerReviewQuestions
              peerReview={peerReview}
              languageInfo={languageInfo}
            />
          ) : (
            <UnselectedPeerAnswerActions
              answer={answer}
              languageInfo={languageInfo}
            />
          )}
        </div>
      ))}
    </>
  )
}

type PeerReviewQuestionsProps = {
  peerReview: PeerReviewAnswer
  languageInfo: PeerReviewLabels
}

const PeerReviewQuestions: React.FunctionComponent<
  PeerReviewQuestionsProps
> = ({ peerReview, languageInfo }) => {
  const quiz = useTypedSelector(state => state.quiz)

  const submitDisabled = useTypedSelector(
    state => state.peerReviews.submitDisabled,
  )

  const dispatch = useDispatch()

  if (!quiz) {
    return <div />
  }

  const peerReviewQuestions = quiz.peerReviewCollections

  const changeInPeerReviewGrade = (peerReviewQuestionId: string) => (
    value: string,
  ) => {
    dispatch(
      peerReviewsActions.changeGrade(peerReviewQuestionId, Number(value)),
    )
  }

  const changeInPeerReviewText = (peerReviewQuestionId: string) => (
    e: MiscEvent,
  ) => {
    dispatch(
      peerReviewsActions.changeText(
        peerReviewQuestionId,
        e.currentTarget.value,
      ),
    )
  }

  const submitPeerReview = () => {
    dispatch(peerReviewsActions.submit())
  }

  return (
    <div>
      {peerReviewQuestions[0].questions.map(question => {
        let currentPeerReviewAnswer = peerReview.answers.find(
          answer => answer.peerReviewQuestionId === question.id,
        )
        if (!currentPeerReviewAnswer) {
          return <div />
        }

        switch (question.type) {
          case "essay":
            currentPeerReviewAnswer = currentPeerReviewAnswer as PeerReviewEssayAnswer
            return (
              <TextualPeerReviewFeedback
                handleTextChange={changeInPeerReviewText(question.id)}
                key={question.id}
                currentText={currentPeerReviewAnswer.text}
                questionTexts={question.texts[0]}
              />
            )
            break
          case "grade":
            currentPeerReviewAnswer = currentPeerReviewAnswer as PeerReviewGradeAnswer

            return (
              <LikertScale
                key={question.id}
                reviews={[
                  {
                    question: question.texts[0].title,
                    review: currentPeerReviewAnswer.value,
                  },
                ]}
                onClick={changeInPeerReviewGrade(question.id)}
              />
            )
          default:
            return (
              <SpaciousTypography>{`The ${
                question.type
              } type peer review question is not supported`}</SpaciousTypography>
            )
        }
      })}

      <StyledButton
        variant="contained"
        color="primary"
        disabled={submitDisabled}
        onClick={submitPeerReview}
      >
        {languageInfo.submitPeerReviewLabel}
      </StyledButton>
    </div>
  )
}

interface ITextualPeerReviewFeedback {
  handleTextChange: (a: any) => any
  key: string
  currentText: string
  questionTexts: PeerReviewQuestionText
}

const StyledReviewEssayQuestion = styled.div`
  margin: 8px 0;
`

const TextualPeerReviewFeedback: React.FunctionComponent<
  ITextualPeerReviewFeedback
> = ({ currentText, handleTextChange, questionTexts }) => {
  const languages = useTypedSelector(state => state.language.languageLabels)

  if (!languages) {
    return <div />
  }

  return (
    <StyledReviewEssayQuestion>
      <MarkdownText Component={Typography} variant="subtitle1">
        {questionTexts.title}
      </MarkdownText>
      <MarkdownText Component={Typography} variant="body1">
        {questionTexts.body}
      </MarkdownText>

      <TextField
        variant="outlined"
        label={languages.peerReviews.essayQuestionAnswerTextBoxLabel}
        value={currentText}
        onChange={handleTextChange}
        fullWidth={true}
        multiline={true}
        rows={5}
        margin="normal"
      />
    </StyledReviewEssayQuestion>
  )
}

type UnselectedPeerAnswerActionsProps = {
  languageInfo: PeerReviewLabels
  answer: QuizAnswer
}

const UnselectedPeerAnswerActions: React.FunctionComponent<
  UnselectedPeerAnswerActionsProps
> = ({ languageInfo, answer }) => {
  const dispatch = useDispatch()

  const flagAsSpam = () => {
    dispatch(peerReviewsActions.postSpam(answer.id))
  }

  const selectAnswer = () => {
    dispatch(peerReviewsActions.selectAnswerToReview(answer.id))
  }

  return (
    <Grid container={true} justify="space-between">
      <Grid item>
        <Button variant="contained" onClick={flagAsSpam}>
          {languageInfo.reportAsInappropriateLabel}
        </Button>
      </Grid>

      <Grid item>
        <Button variant="contained" onClick={selectAnswer}>
          {languageInfo.chooseButtonLabel}
        </Button>
      </Grid>
    </Grid>
  )
}

export default PeerReviewForm

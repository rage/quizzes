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
  PeerReviewEssayAnswer,
  PeerReviewGradeAnswer,
  PeerReviewQuestionText,
  MiscEvent,
} from "../../modelTypes"
import {
  BaseButton,
  SpaciousTypography,
  StyledButton,
  RedButton,
} from "../styleComponents"
import styled from "styled-components"

import SelectButton from "./SelectButton"
import SpamButton from "./SpamButton"
import PeerReviewSubmitButton from "./PeerReviewSubmitButton"

const BoldTypography = styled(Typography)`
  font-weight: bold;
`

const TopMarginDiv = styled.div`
  margin-top: 15px;
`

type PeerReviewFormProps = {
  languageInfo: PeerReviewLabels
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  languageInfo,
}) => {
  const answersToReview = useTypedSelector(state => state.peerReviews.options)
  const peerReview = useTypedSelector(state => state.peerReviews.answer)

  if (!answersToReview) {
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

  if (answersToReview.length === 0) {
    return <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
  }

  const chosenStyle = { fontSize: "1.5rem", fontStyle: "bold" }

  // choice has been made
  if (peerReview) {
    const chosenAnswer = answersToReview.find(
      a => a.id === peerReview.quizAnswerId,
    )
    if (!chosenAnswer) {
      return <div>Chosen answer id doesn't belong to any of the options</div>
    }

    return (
      <>
        <BoldTypography>{languageInfo.chosenEssayInstruction}</BoldTypography>
        <PeerReviewOption answer={chosenAnswer} />
        <SelectButton onClick={() => {}}>Peru valinta</SelectButton>
        <PeerReviewQuestions
          peerReview={peerReview}
          languageInfo={languageInfo}
        />
      </>
    )
  }

  return (
    <>
      <BoldTypography>{languageInfo.chooseEssayInstruction}</BoldTypography>

      {answersToReview.map((answer, idx) => (
        <TopMarginDiv key={answer.id}>
          <Typography variant="subtitle1">
            {`${languageInfo.optionLabel} ${idx + 1}:`}
          </Typography>
          <PeerReviewOption answer={answer} />

          <UnselectedPeerAnswerActions
            answer={answer}
            languageInfo={languageInfo}
          />
        </TopMarginDiv>
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
    name: string,
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

      <PeerReviewSubmitButton
        disabled={submitDisabled}
        onClick={submitPeerReview}
      >
        {languageInfo.submitPeerReviewLabel}
      </PeerReviewSubmitButton>
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
      <MarkdownText Component={BoldTypography} variant="subtitle1">
        {questionTexts.title}
      </MarkdownText>

      {questionTexts.body && (
        <MarkdownText Component={Typography} variant="body1">
          {questionTexts.body}
        </MarkdownText>
      )}

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
  const [disabled, setDisabled] = React.useState(false)
  const dispatch = useDispatch()

  const flagAsSpam = () => {
    setDisabled(true)
    dispatch(peerReviewsActions.postSpam(answer.id))
  }

  const selectAnswer = () => {
    dispatch(peerReviewsActions.selectAnswerToReview(answer.id))
  }

  return (
    <Grid container={true} justify="space-between">
      <Grid item>
        <SpamButton disabled={disabled} onClick={flagAsSpam}>
          {languageInfo.reportAsInappropriateLabel}
        </SpamButton>
      </Grid>

      <Grid item>
        <SelectButton onClick={selectAnswer}>
          {languageInfo.chooseButtonLabel}
        </SelectButton>
      </Grid>
    </Grid>
  )
}

export default PeerReviewForm

import * as React from "react"
import { useContext, useRef, useState } from "react"
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
import { scrollToRef } from "../../utils"
import { PeerReviewLabels } from "../../utils/languages"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewEssayAnswer,
  PeerReviewGradeAnswer,
  PeerReviewQuestion,
  PeerReviewQuestionText,
  MiscEvent,
} from "../../modelTypes"
import {
  BoldTypography,
  BoldTypographyMedium,
  SpaciousTypography,
  TopMarginDivLarge,
  TopMarginDivSmall,
  withMargin,
} from "../styleComponents"
import styled from "styled-components"

import SelectButton from "./SelectButton"
import SpamButton from "./SpamButton"
import PeerReviewSubmitButton from "./PeerReviewSubmitButton"
import Notification from "../Notification"
import ThemeProviderContext from "../../contexes/themeProviderContext"

interface ButtonWrapperProps {
  providedStyles: string | undefined
}

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  display: flex;
  margin: 1rem 0 2rem;
  button:last-of-type {
    margin-left: auto;
  }
  ${({ providedStyles }) => providedStyles}
`

interface QuestionBlockWrapperProps {
  providedStyles: string | undefined
}

const QuestionBlockWrapper = styled.div<QuestionBlockWrapperProps>`
  ${({ providedStyles }) => providedStyles}
`

type PeerReviewFormProps = {
  languageInfo: PeerReviewLabels
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  languageInfo,
}) => {
  const themeProvider = useContext(ThemeProviderContext)

  const ref = useState(useRef(null))[0]

  const answersToReview = useTypedSelector(state => state.peerReviews.options)
  const peerReview = useTypedSelector(state => state.peerReviews.answer)
  const dispatch = useDispatch()

  const unselectAnswer = () => {
    dispatch(peerReviewsActions.unselectAnswer())
    scrollToRef(ref)
  }

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

  const Instructions = withMargin(BoldTypographyMedium, "2rem 0 0")
  const OptionTypography = withMargin(BoldTypography, "0 0 1rem")

  // choice has been made
  if (peerReview) {
    const chosenAnswer = answersToReview.find(
      a => a.id === peerReview.quizAnswerId,
    )
    if (!chosenAnswer) {
      return <div>Chosen answer id doesn't belong to any of the options</div>
    }

    return (
      <div ref={ref}>
        <Instructions>{languageInfo.chosenEssayInstruction}</Instructions>
        <TopMarginDivLarge>
          <PeerReviewOption answer={chosenAnswer} />
          <ButtonWrapper providedStyles={themeProvider.buttonWrapperStyles}>
            <SelectButton onClick={unselectAnswer}>
              {languageInfo.unselectButtonLabel}
            </SelectButton>
          </ButtonWrapper>
          <PeerReviewQuestions
            peerReview={peerReview}
            languageInfo={languageInfo}
            scrollRef={ref}
          />
        </TopMarginDivLarge>
      </div>
    )
  }

  return (
    <div ref={ref}>
      <TopMarginDivLarge>
        <BoldTypographyMedium>
          {languageInfo.chooseEssayInstruction}
        </BoldTypographyMedium>
      </TopMarginDivLarge>
      {answersToReview.map((answer, idx) => (
        <TopMarginDivLarge key={answer.id}>
          <OptionTypography>
            {`${languageInfo.optionLabel} ${idx + 1}:`}
          </OptionTypography>
          <PeerReviewOption answer={answer} />
          <ReportOrSelect
            answer={answer}
            languageInfo={languageInfo}
            scrollRef={ref}
          />
        </TopMarginDivLarge>
      ))}
      <Notification />
    </div>
  )
}

type PeerReviewQuestionsProps = {
  peerReview: PeerReviewAnswer
  languageInfo: PeerReviewLabels
  scrollRef: any
}

const PeerReviewQuestions: React.FunctionComponent<
  PeerReviewQuestionsProps
> = ({ peerReview, languageInfo, scrollRef }) => {
  const themeProvider = useContext(ThemeProviderContext)

  const quiz = useTypedSelector(state => state.quiz)

  const submitDisabled = useTypedSelector(
    state => state.peerReviews.submitDisabled,
  )
  const error = useTypedSelector(state => state.message.error)

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
    scrollToRef(scrollRef)
  }

  const questions = peerReviewQuestions[0].questions

  const blocks: PeerReviewQuestion[][] = []
  let block: PeerReviewQuestion[] = []

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].type === "essay") {
      block.length > 0 && blocks.push(block)
      block = []
    }
    block.push(questions[i])
    if (i === questions.length - 1) {
      blocks.push(block)
    }
  }

  return (
    <div>
      {blocks.map(block => {
        return (
          <QuestionBlockWrapper
            providedStyles={themeProvider.questionBlockWrapperStyles}
          >
            {block.map(question => {
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
                      separatorType={
                        themeProvider.likertSeparatorType || "dotted-line"
                      }
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
          </QuestionBlockWrapper>
        )
      })}
      <Notification />
      <PeerReviewSubmitButton
        disabled={submitDisabled || error}
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
      <MarkdownText Component={BoldTypographyMedium} variant="subtitle1">
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

type ReportOrSelectProps = {
  languageInfo: PeerReviewLabels
  answer: QuizAnswer
  scrollRef: any
}

const ReportOrSelect: React.FunctionComponent<ReportOrSelectProps> = ({
  languageInfo,
  answer,
  scrollRef,
}) => {
  const themeProvider = useContext(ThemeProviderContext)

  const error = useTypedSelector(state => state.message.error)
  const [disabled, setDisabled] = React.useState(false)
  const dispatch = useDispatch()

  const flagAsSpam = () => {
    setDisabled(true)
    dispatch(peerReviewsActions.postSpam(answer.id))
    scrollToRef(scrollRef)
  }

  const selectAnswer = () => {
    dispatch(peerReviewsActions.selectAnswerToReview(answer.id))
    scrollToRef(scrollRef)
  }

  return (
    <ButtonWrapper providedStyles={themeProvider.buttonWrapperStyles}>
      <SpamButton disabled={disabled || error} onClick={flagAsSpam}>
        {languageInfo.reportAsInappropriateLabel}
      </SpamButton>
      <SelectButton onClick={selectAnswer}>
        {languageInfo.chooseButtonLabel}
      </SelectButton>
    </ButtonWrapper>
  )
}

export default PeerReviewForm

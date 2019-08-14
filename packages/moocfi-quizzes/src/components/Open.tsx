import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { StyledTextField } from "./styleComponents"
import { SpaciousPaper } from "./styleComponents"
import { QuizItem, MiscEvent } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import MarkdownText from "./MarkdownText"

type OpenProps = {
  item: QuizItem
}

interface SolutionPaperProps {
  correct: boolean | undefined
}

const SolutionPaper = styled(SpaciousPaper)<SolutionPaperProps>`
  border-left: 1rem solid ${props => (props.correct ? "#047500" : "#DB0000")};

  p {
    margin: 0;
  }
`

const Open: React.FunctionComponent<OpenProps> = ({ item }) => {
  const dispatch = useDispatch()

  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const displayFeedback = useTypedSelector(state => state.feedbackDisplayed)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  if (!languageInfo) {
    return <div />
  }

  const handleTextDataChange = (e: MiscEvent) => {
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))
  }

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const correct = itemAnswer ? itemAnswer.correct : false
  const textData = itemAnswer ? itemAnswer.textData : ""

  const openLabels = languageInfo.open

  const answerLocked = userQuizState && userQuizState.status === "locked"
  const itemTitle = item.texts[0].title

  const { successMessage, failureMessage } = item.texts[0]

  const guidance = (
    <>
      <MarkdownText variant="h6">{itemTitle}</MarkdownText>
      <MarkdownText variant="body1">{item.texts[0].body}</MarkdownText>
    </>
  )

  if (displayFeedback) {
    const answerPortion = answerLocked ? (
      <SpaciousPaper>
        <Typography variant="body1">{textData}</Typography>
      </SpaciousPaper>
    ) : (
      <StyledTextField
        rowNumber={item.order}
        value={textData}
        onChange={handleTextDataChange}
        fullWidth
        margin="normal"
        variant="outlined"
        label={openLabels.placeholder}
      />
    )

    return (
      <div>
        {guidance}
        {
          <Typography variant="subtitle1">
            {openLabels.userAnswerLabel}:
          </Typography>
        }
        {answerPortion}
        <SolutionPaper correct={correct}>
          <MarkdownText Component={Typography} variant="body1">
            {correct
              ? successMessage || openLabels.feedbackForSuccess
              : failureMessage || openLabels.feedbackForFailure}
          </MarkdownText>
        </SolutionPaper>
      </div>
    )
  }

  return (
    <div>
      {guidance}
      <StyledTextField
        rowNumber={item.order}
        value={textData}
        onChange={handleTextDataChange}
        fullWidth
        margin="normal"
        variant="outlined"
        label={openLabels.placeholder}
        disabled={quizDisabled}
      />
    </div>
  )
}

export default Open

import * as React from "react"
import { useDispatch } from "react-redux"
import { TextField, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem, MiscEvent } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import MarkdownText from "./MarkdownText"

type FeedbackProps = {
  item: QuizItem
}

const Feedback: React.FunctionComponent<FeedbackProps> = ({ item }) => {
  const dispatch = useDispatch()

  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const itemTitle = item.title
  const itemBody = item.body

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)

  if (!itemAnswer && quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const textData = itemAnswer ? itemAnswer.textData : ""

  return (
    <div style={{ marginBottom: 10 }}>
      <MarkdownText
        Component={Typography}
        variant="subtitle1"
        variantMapping={{ subtitle1: "p" }}
      >
        {itemTitle}
      </MarkdownText>
      <MarkdownText Component={Typography}>{itemBody}</MarkdownText>
      {answerLocked ? (
        <Typography variant="body1">{textData}</Typography>
      ) : (
        <TextField
          variant="outlined"
          value={textData}
          onChange={handleTextDataChange}
          fullWidth={true}
          multiline={true}
          rows={10}
          margin="normal"
        />
      )}
    </div>
  )
}

export default Feedback

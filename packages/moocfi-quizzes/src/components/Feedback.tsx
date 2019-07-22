import * as React from "react"
import { useDispatch } from "react-redux"
import { TextField, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem, MiscEvent } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"

type FeedbackProps = {
  item: QuizItem
}

const Feedback: React.FunctionComponent<FeedbackProps> = ({ item }) => {
  const dispatch = useDispatch()

  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const itemTitle = item.texts[0].title

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)

  if (!itemAnswer) {
    return <LaterQuizItemAddition item={item} />
  }

  const textData = itemAnswer.textData

  return (
    <div style={{ marginBottom: 10 }}>
      <Typography variant="subtitle1">{itemTitle}</Typography>
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

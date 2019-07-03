import * as React from "react"
import { useDispatch } from "react-redux"
import { TextField, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem } from "../modelTypes"

type FeedbackProps = {
  item: QuizItem
}

const Feedback: React.FunctionComponent<FeedbackProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleTextDataChange = ((itemId: string) => (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) =>
    dispatch(quizAnswerActions.changeTextData(itemId, e.currentTarget.value)))(
    item.id,
  )

  const answer = useTypedSelector(state => state.quizAnswer)
  const answered = answer.id ? true : false
  const itemTitle = item.texts[0].title

  const textData = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
    .textData

  return (
    <div style={{ marginBottom: 10 }}>
      <Typography variant="subtitle1">{itemTitle}</Typography>
      {answered ? (
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

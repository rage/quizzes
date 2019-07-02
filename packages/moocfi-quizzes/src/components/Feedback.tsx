import * as React from "react"
import { TextField, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"

type FeedbackProps = {
  item: QuizItem
  textData: string
  handleTextDataChange: (e: React.FormEvent) => void
}

const Feedback: React.FunctionComponent<FeedbackProps> = ({
  item,
  textData,
  handleTextDataChange,
}) => {
  const answer = useTypedSelector(state => state.quizAnswer)
  const answered = answer.id ? true : false
  const itemTitle = item.texts[0].title

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

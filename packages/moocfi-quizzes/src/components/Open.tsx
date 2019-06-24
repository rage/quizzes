import * as React from "react"
import { useSelector, shallowEqual } from "react-redux"
import { TextField, Typography, Paper } from "@material-ui/core"

type OpenProps = {
  correct: boolean
  handleTextDataChange: (any) => any
  languageInfo: any
  textData: string
  item
}

const Open: React.FunctionComponent<OpenProps> = ({
  correct,
  handleTextDataChange,
  languageInfo,
  textData,
  item,
}) => {
  const answer = useSelector((state: any) => state.quizAnswer, shallowEqual)
  const answered = answer.id ? true : false
  const itemTitle = item.texts[0].title
  const successMessage = item.texts[0].successMessage
  const failureMessage = item.texts[0].failureMessage

  const guidance = (
    <>
      <Typography variant="h6" style={{ paddingBottom: 10 }}>
        {itemTitle}
      </Typography>
      <Typography
        variant="body1"
        style={{ paddingBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: item.texts[0].body }}
      />
    </>
  )

  if (answered) {
    return (
      <div>
        {guidance}
        <Typography variant="subtitle1">
          {languageInfo.userAnswerLabel}:
        </Typography>
        <Paper style={paper}>
          <Typography variant="body1">{textData}</Typography>
        </Paper>
        <Paper style={answerStyle(correct)}>
          <Typography variant="body1">
            {correct ? successMessage : failureMessage}
          </Typography>
        </Paper>
      </div>
    )
  }

  return (
    <div>
      {guidance}
      <TextField
        value={textData}
        onChange={handleTextDataChange}
        fullWidth
        margin="normal"
        placeholder={languageInfo.placeholder}
      />
    </div>
  )
}

const answerStyle = correct => ({
  ...paper,
  borderLeft: `1em solid ${correct ? "green" : "red"}`,
})

const paper = {
  padding: 10,
  margin: 10,
}

export default Open

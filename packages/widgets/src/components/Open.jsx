import React from "react"
import { TextField, Typography, Paper } from "@material-ui/core"

const Open = ({
  answered,
  correct,
  handleTextDataChange,
  languageInfo,
  textData,
  successMessage,
  failureMessage,
}) => {
  if (answered) {
    return (
      <div>
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

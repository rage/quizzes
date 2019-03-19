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
  item,
}) => {
  const guidance = (
    <React.Fragment>
      <Typography variant="h6" style={{ paddingBottom: 10 }}>
        {item.texts[0].title}
      </Typography>
      <Typography
        variant="body1"
        style={{ paddingBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: item.texts[0].body }}
      />
    </React.Fragment>
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

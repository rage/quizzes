import React from "react"
import { Paper, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../../utils/string_tools"

const Essay = ({
  itemTitle,
  itemBody,
  itemAnswer,
  textData,
  handleTextDataChange,
  answered,
  item,
  languageInfo,
}) => {
  const paper = {
    padding: 10,
    margin: 10,
  }

  const answerPortion = answered ? (
    <React.Fragment>
      <Typography variant="subtitle1">
        {languageInfo.userAnswerLabel + ": "}
      </Typography>
      <Paper style={paper}>
        <Typography variant="body1">{textData}</Typography>
      </Paper>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <TextField
        variant="outlined"
        label="Vastauksesi"
        value={textData}
        onChange={handleTextDataChange}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
      />
      <div>Sanoja: {wordCount(textData)}</div>
    </React.Fragment>
  )

  return (
    <div>
      <Typography variant="h6" style={{ paddingBottom: 10 }}>
        {itemTitle}
      </Typography>
      <Typography
        variant="body1"
        style={{ paddingBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: itemBody }}
      />

      {answerPortion}
    </div>
  )
}

export default Essay

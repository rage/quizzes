import React from "react"
import { TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"

const EssayStageContainer = ({
  itemTitle,
  itemBody,
  textData,
  handleTextDataChange,
}) => (
  <div>
    <Typography variant="h6" style={{ paddingBottom: 10 }}>
      {itemTitle}
    </Typography>
    <Typography
      variant="body1"
      style={{ paddingBottom: 10 }}
      dangerouslySetInnerHTML={{ __html: itemBody }}
    />
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
  </div>
)

function wordCount(string) {
  if (!string) {
    return 0
  }
  return string.match(/[^\s]+/g).length
}

export default EssayStageContainer

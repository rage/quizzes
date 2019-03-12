import React from "react"
import { TextField } from "@material-ui/core"

const EssayStageContainer = ({ textData, handleTextDataChange }) => (
  <div>
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

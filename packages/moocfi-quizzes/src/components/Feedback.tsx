import React from "react"
import { TextField, Typography } from "@material-ui/core"

export default props => (
  <div style={{ marginBottom: 10 }}>
    <Typography variant="subtitle1">{props.itemTitle}</Typography>
    {props.answered ? (
      <Typography variant="body1">{props.textData}</Typography>
    ) : (
      <TextField
        variant="outlined"
        value={props.textData}
        onChange={props.handleTextDataChange}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
      />
    )}
  </div>
)

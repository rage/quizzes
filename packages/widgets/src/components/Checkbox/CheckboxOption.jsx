import React from "react"
import { Grid, Checkbox, Typography } from "@material-ui/core"

export default ({ body, title, value, toggle, answered }) => {
  const checkboxOptions = {
    disabled: answered,
    checked: value !== undefined,
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        <Checkbox
          value={value ? value.quizOptionId : ""}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
        />
      </Grid>
      <Grid item xs style={{ alignSelf: "center" }}>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        {body && body !== title && (
          <Typography variant="body1">{body}</Typography>
        )}
      </Grid>
    </Grid>
  )
}

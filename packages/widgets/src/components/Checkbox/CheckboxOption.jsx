import React from "react"
import { Grid, Checkbox } from "@material-ui/core"

export default ({ label, value, toggle, answered }) => {
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
        {label}
      </Grid>
    </Grid>
  )
}

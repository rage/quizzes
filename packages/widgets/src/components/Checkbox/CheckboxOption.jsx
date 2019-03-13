import React from "react"
import { Grid, Checkbox } from "@material-ui/core"

export default ({ label, value, toggle, answered }) => {
  let checkboxOptions = {
    disabled: answered,
  }
  if (answered) {
    checkboxOptions.checked = true
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        <Checkbox
          value={value}
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

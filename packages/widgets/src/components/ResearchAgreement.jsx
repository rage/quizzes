import React from "react"
import { Checkbox, Grid } from "@material-ui/core"

const ResearchAgreement = ({ options, item }) => {
  console.log(options)

  return (
    <React.Fragment>
      {options.map(option => {
        return (
          <Grid container style={{ marginBottom: 10 }} key={option.id}>
            <Grid item xs={1}>
              <Checkbox color="primary" />
            </Grid>
            <Grid item xs style={{ alignSelf: "center" }}>
              {option.texts[0].title}
            </Grid>
          </Grid>
        )
      })}
    </React.Fragment>
  )
}

export default ResearchAgreement

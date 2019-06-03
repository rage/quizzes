import { Grid, Typography } from "@material-ui/core"
import React from "react"

const GeneralStatistics = ({ answers }) => {
  return (
    <React.Fragment>
      <Grid
        item={true}
        xs={12}
        style={{ marginBottom: "1.5em", textAlign: "center" }}
      >
        <Typography variant="title">QUIZ STATISTICS</Typography>
      </Grid>

      <Grid
        container={true}
        spacing={32}
        style={{ backgroundColor: "#49C7FB" }}
      >
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Answers requiring attention: {answers.length}
          </Typography>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="body1">Of those:</Typography>
          <ul>
            <li>
              <Grid item={true} xs={12}>
                <Typography variant="body1">
                  Waiting for peer review(s): {"-"}
                </Typography>
              </Grid>
            </li>
            <li>
              <Typography variant="body1">Flagged as spam: {"-"}</Typography>
            </li>
          </ul>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default GeneralStatistics

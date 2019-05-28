import { Grid, Typography } from "@material-ui/core"
import React from "react"

const GeneralStatistics = ({ answers, answerStatistics }) => {
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
              <Typography variant="body1">
                Deprecated:{" "}
                {answers.filter(a => a.status === "deprecated").length}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Spam: {answers.filter(a => a.status === "spam").length}{" "}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Rejected: {answers.filter(a => a.status === "rejected").length}
              </Typography>
            </li>
          </ul>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Submissions: {answerStatistics.count || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Mean: {answerStatistics.average || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Sd: {answerStatistics.stddev_pop || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          Waiting for peer review: xx
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default GeneralStatistics

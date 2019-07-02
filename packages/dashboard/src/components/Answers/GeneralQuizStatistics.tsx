import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"

class GeneralStatistics extends React.Component<any, any> {
  public render() {
    return (
      <React.Fragment>
        <Grid
          item={true}
          xs={12}
          style={{ marginBottom: "1.5em", textAlign: "center" }}
        >
          <Typography variant="title">QUIZ STATISTICS</Typography>
        </Grid>

        <Grid item={true} xs="auto">
          <Grid
            container={true}
            spacing={32}
            style={{ backgroundColor: "#49C7FB", marginBottom: "1em" }}
          >
            <Grid item={true} xs={12}>
              <Typography variant="body1">
                Answers requiring attention: {this.props.numberOfAnswers}
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
                  <Typography variant="body1">
                    Flagged as spam: {"-"}
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    counts: state.answerCounts,
  }
}

export default connect(mapStateToProps)(GeneralStatistics)

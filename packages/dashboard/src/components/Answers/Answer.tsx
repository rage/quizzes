import { Button, Card, Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { setCourse } from "../../store/filter/actions"
import ItemAnswer from "./ItemAnswer"

class Answer extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid
        item={true}
        xs={12}
        style={{ marginRight: "1em" }}
        onMouseEnter={this.showMore}
        onMouseLeave={this.showLess}
      >
        <Card
          raised={true}
          square={true}
          style={{
            borderLeft:
              "1em solid " +
              (this.props.answerData.status === "submitted" ||
              this.props.answerData.status === "spam"
                ? "#FB6949"
                : "#49C7FB"),
          }}
        >
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <ItemAnswer
                idx={this.props.idx}
                answer={this.props.answerData}
                quiz={this.props.quiz}
              />
            </Grid>

            {this.state.expanded && (
              <PeerReviewsSummary
                answer={this.props.answerData}
                spamFlags={
                  this.props.answerStatistics.find(
                    as => as.quiz_answer_id === this.props.answerData.id,
                  ).count
                }
              />
            )}

            <Grid item={true} xs={12} style={{ backgroundColor: "#E5E5E5" }}>
              <Grid
                container={true}
                spacing={8}
                justify="space-between"
                style={{ margin: ".5em .25em .25em .25em" }}
              >
                <Grid item={true} xs={4} md={3}>
                  <Grid container={true} spacing={16}>
                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#029422",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Accept
                      </Button>
                    </Grid>

                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#D80027",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item={true} xs={2} style={{ textAlign: "center" }}>
                  <Typography>Avg: 3,14</Typography>

                  <Typography>SD: 1,00</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  private showMore = () => {
    this.setState({
      expanded: true,
    })
  }

  private showLess = () => {
    this.setState({
      expanded: false,
    })
  }
}

const PeerReviewsSummary = ({ answer, spamFlags }) => {
  return (
    <Grid item={true} xs={12} style={{ margin: "0em 0em 1em 1em" }}>
      <Grid
        container={true}
        justify="flex-start"
        alignItems="stretch"
        spacing={16}
      >
        <Grid
          item={true}
          xs={12}
          md={3}
          style={{ borderRight: "1px dashed #9D9696" }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            SPAM FLAGS: {spamFlags}
          </Typography>
          <Link to={`/answers/${answer.id}`}>VIEW PEER REVIEWS</Link>
        </Grid>

        <Grid item={true} xs={12} md={9}>
          <Grid
            container={true}
            alignItems="center"
            spacing={24}
            style={{ marginBottom: "2em" }}
          >
            <Grid item={true} xs={4} lg={3} xl={2} />
            <Grid item={true} xs={4}>
              <Typography variant="subtitle1">AVERAGE POINTS</Typography>
            </Grid>
            <Grid item={true} xs={4}>
              <Typography variant="subtitle1">STANDARD DEVIATION</Typography>
            </Grid>
            <Grid item={true} xs="auto" lg={1} xl={2} />

            {answer.itemAnswers.map((ia, idx) => {
              return (
                <React.Fragment key={ia.quizItemId}>
                  <Grid item={true} xs={4} lg={3} xl={2}>
                    QUESTION {idx + 1}:
                  </Grid>
                  <Grid item={true} xs={4}>
                    xx
                  </Grid>
                  <Grid item={true} xs={4}>
                    xx
                  </Grid>
                  <Grid item={true} xs="auto" lg={1} xl={2} />
                </React.Fragment>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = state => {
  return {
    answerStatistics: state.answerStatistics,
  }
}

export default connect(
  mapStateToProps,
  { setCourse },
)(Answer)

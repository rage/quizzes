import { Button, Card, Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { setCourse, setQuiz } from "../../store/filter/actions"
import ItemAnswer from "./ItemAnswer"
import PeerReviewsModal from "./PeerReviewsModal"

class Answer extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      modalOpen: false,
    }
  }

  public componentDidMount() {
    this.props.setQuiz(this.props.answerData.quizId)
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
                peerReviewsAnswers={this.props.peerReviews}
                peerReviewsQuestions={
                  this.props.quizzes.find(
                    q => q.id === this.props.answerData.quizId,
                  ).peerReviewCollections[0].questions
                }
                answer={this.props.answerData}
                spamFlags={
                  this.props.answerStatistics.find(
                    as => as.quiz_answer_id === this.props.answerData.id,
                  ).count
                }
                setQuiz={this.props.setQuiz}
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
                  <Typography>
                    Avg: {this.average(this.props.answerData)}
                  </Typography>

                  <Typography>
                    SD: {this.standardDeviation(this.props.answerData)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  private average = (allPeerReviews: any) => {
    return "xx"
  }

  private standardDeviation = (allPeerReviews: any) => {
    return "yy"
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

class PeerReviewsSummary extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
    }
  }

  public render() {
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
              SPAM FLAGS: {this.props.spamFlags}
            </Typography>
            <Button variant="outlined" onClick={this.openModal}>
              VIEW PEER REVIEWS
            </Button>
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

              {this.props.peerReviewsAnswers &&
                (this.props.peerReviewsAnswers.length === 0 ||
                  this.props.peerReviewsAnswers[0].quizAnswerId ===
                    this.props.answer.id) &&
                this.props.peerReviewsQuestions.map((question, idx) => (
                  <React.Fragment key={question.id}>
                    <Grid item={true} xs={4} lg={3} xl={2}>
                      {question.texts[0].title || "No title"}{" "}
                      {question.type === "essay" && " (Essay)"}:
                    </Grid>
                    <Grid item={true} xs={4}>
                      {question.type === "essay"
                        ? "NA"
                        : this.averagePoints(
                            this.props.peerReviewsAnswers,
                            idx,
                          ).toFixed(2)}
                    </Grid>
                    <Grid item={true} xs={4}>
                      {question.type === "essay"
                        ? "NA"
                        : this.standardDeviation(
                            this.props.peerReviewsAnswers,
                            idx,
                          ).toFixed(2)}
                    </Grid>
                    <Grid item={true} xs="auto" lg={1} xl={2} />
                  </React.Fragment>
                ))}
            </Grid>
          </Grid>
        </Grid>
        <PeerReviewsModal
          answer={this.props.answer}
          peerReviews={this.props.peerReviewsAnswers}
          open={this.state.modalOpen}
          onClose={this.closeModal}
        />
      </Grid>
    )
  }

  private averagePoints = (prAnswers: any[], questionIdx: number): number => {
    const scores = prAnswers.map(a => a.answers[questionIdx].value)
    if (scores.length === 0) {
      return -1
    }

    return scores.reduce((acc, score) => acc + score, 0) / scores.length
  }

  private standardDeviation = (
    prAnswers: any[],
    questionIdx: number,
  ): number => {
    const scores = prAnswers.map(a => a.answers[questionIdx].value)
    if (scores.length === 0) {
      return -1
    }
    const average = this.averagePoints(prAnswers, questionIdx)
    if (average < 0) {
      return -1
    }
    // population sd, not sample
    return Math.sqrt(
      scores.reduce((acc, elem) => acc + Math.pow(elem - average, 2), 0) /
        scores.length,
    )
  }

  private openModal = () => {
    this.setState({
      modalOpen: true,
    })
  }

  private closeModal = () => {
    this.setState({
      modalOpen: false,
    })
  }
}

const mapStateToProps = state => {
  return {
    answerStatistics: state.answerStatistics,
    quizzes: state.quizzes,
  }
}

export default connect(
  mapStateToProps,
  { setCourse, setQuiz },
)(Answer)

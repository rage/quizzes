import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  RootRef,
  Typography,
} from "@material-ui/core"
import ExpandLess from "@material-ui/icons/ExpandLess"
import MoreVert from "@material-ui/icons/MoreVert"
import React from "react"
import { connect } from "react-redux"
import { updateQuizAnswerStatus } from "../../services/quizAnswers"
import { decrement } from "../../store/answerCounts/actions"
import { setQuiz } from "../../store/filter/actions"
import { displayMessage } from "../../store/notification/actions"
import ItemAnswer from "./ItemAnswer"
import PeerReviewsModal from "./PeerReviewsModal"

class Answer extends React.Component<any, any> {
  private answerRef: React.RefObject<HTMLElement>

  private borderColorsByStatus = {
    submitted: "#FB6949",
    spam: "#FB6949",
    confirmed: "#48fa5d",
    rejected: "#d80027",
    deprecated: "#9b9b9b",
    "enough-received-but-not-given": "#FB6949",
    "manual-review": "#FB6949",
  }

  constructor(props) {
    super(props)
    this.answerRef = React.createRef<HTMLElement>()
    this.state = {
      expanded: true,
      modalOpen: false,
      confirmDialogOpen: false,
      confirmAction: null,
    }
  }

  public render() {
    const peerAverage = this.average(this.props.answerData.peerReviews)
    const peerSd = this.standardDeviation(this.props.answerData.peerReviews)

    const peerReviewCollections = this.props.quizzes.find(
      q => q.id === this.props.answerData.quizId,
    ).peerReviewCollections

    return (
      <RootRef rootRef={this.answerRef}>
        <Grid item={true} xs={12} style={{ marginRight: "1em" }}>
          <Card
            raised={true}
            square={true}
            style={{
              borderLeft:
                "1em solid " +
                this.borderColorsByStatus[this.props.answerData.status],
            }}
          >
            <Grid container={true} justify="center">
              <Grid item={true} xs={12} style={{ paddingRight: "1em" }}>
                <ItemAnswer
                  idx={this.props.idx}
                  answer={this.props.answerData}
                  quiz={this.props.quiz}
                  fullLength={this.state.expanded}
                />
              </Grid>

              {!this.state.expanded &&
                ((this.props.quiz.peerReviewCollections &&
                  this.props.quiz.peerReviewCollections.length > 0) ||
                  !this.itemAnswersDisplayedInFull(this.props.answerData)) && (
                  <Grid item={true} xs="auto">
                    <IconButton onClick={this.showMore}>
                      <MoreVert />
                    </IconButton>
                  </Grid>
                )}

              {this.state.expanded && (
                <React.Fragment>
                  <PeerReviewsSummary
                    peerReviewsAnswers={this.props.peerReviews}
                    peerReviewsQuestions={
                      peerReviewCollections.length > 0
                        ? peerReviewCollections[0].questions
                        : []
                    }
                    answer={this.props.answerData}
                    setQuiz={this.props.setQuiz}
                    course={this.props.courses.find(
                      c => c.id === this.props.filter.course,
                    )}
                  />
                  <Grid item={true} xs="auto">
                    <IconButton onClick={this.showLess}>
                      <ExpandLess />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              )}

              <Grid item={true} xs={12} style={{ backgroundColor: "#E5E5E5" }}>
                <Grid
                  container={true}
                  spacing={8}
                  justify="space-between"
                  style={{
                    padding: ".5em .5em .25em .5em",
                  }}
                >
                  <Grid item={true} xs={6} lg={4}>
                    {this.props.answerData.status === "confirmed" ? (
                      ""
                    ) : (
                      <Grid container={true} justify="flex-start" spacing={16}>
                        <Grid item={true} xs="auto">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "rgb(15, 135, 15)",
                              borderRadius: "0",
                              color: "white",
                            }}
                            onClick={this.confirmStatusChange("accept")}
                          >
                            Accept
                          </Button>
                        </Grid>

                        <Grid item={true} xs="auto">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "rgb(200, 34, 34)",
                              borderRadius: "0",
                              color: "white",
                            }}
                            onClick={this.confirmStatusChange("reject")}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item={true} xs={2} style={{ textAlign: "center" }}>
                    <Typography>
                      Avg:{" "}
                      {peerAverage || peerAverage === 0
                        ? peerAverage.toFixed(2)
                        : "-"}
                    </Typography>

                    <Typography>
                      SD: {peerSd || peerSd === 0 ? peerSd.toFixed(2) : "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          <Dialog
            open={this.state.confirmDialogOpen}
            onClose={this.closeConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirm status change
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you certain you want to {this.state.confirmAction} the
                answer?
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={this.closeConfirmDialog}>Cancel</Button>

              <Button
                onClick={this.modifyStatus(
                  this.state.confirmAction,
                  this.props.answerData.status === "manual-review",
                )}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </RootRef>
    )
  }

  private closeConfirmDialog = () => {
    this.setState({
      confirmDialogOpen: false,
      confirmAction: null,
    })
  }

  private confirmStatusChange = (choice: string) => () => {
    this.setState({
      confirmDialogOpen: true,
      confirmAction: choice,
    })
  }

  private modifyStatus = (
    choice: string,
    requiresAttention: boolean,
  ) => async () => {
    let message
    let errorOccurred = false

    this.closeConfirmDialog()
    try {
      await updateQuizAnswerStatus(
        this.props.answerData.id,
        choice === "accept" ? "confirmed" : "rejected",
        this.props.user,
      )

      message = `Successfully ${
        choice === "accept" ? "confirmed" : "rejected"
      } the answer`

      if (requiresAttention) {
        this.props.decrementAttentionCount(this.props.answerData.quizId)
      }

      this.props.updateAnswers()
    } catch (e) {
      message = `Failed to change the status (${e.message})`
      errorOccurred = true
    }

    this.props.displayMessage(message, errorOccurred, 3)
  }

  private itemAnswersDisplayedInFull = (answer): boolean => {
    const limit = 1500
    return !answer.itemAnswers.some(
      ia => ia.textData && ia.textData.length > limit,
    )
  }

  private average = (allPeerReviews: any): number | undefined => {
    const allGrades = allPeerReviews
      .map(pr => pr.answers)
      .flat()
      .filter(pAnswer => pAnswer.value !== null)
      .map(pAnswer => pAnswer.value)
    if (allGrades.length === 0) {
      return undefined
    }
    const sum = allGrades.reduce((acc, elem) => acc + elem, 0)
    return sum / allGrades.length
  }

  // population sd, not sample
  private standardDeviation = (allPeerReviews: any): number | undefined => {
    const allGrades = allPeerReviews
      .map(pr => pr.answers)
      .flat()
      .filter(pAnswer => pAnswer.value !== null)
      .map(pAnswer => pAnswer.value)

    if (allGrades.length === 0) {
      return undefined
    }
    const avg = this.average(allPeerReviews)
    if (avg === undefined) {
      return undefined
    }
    const sum =
      allGrades.reduce((acc, elem) => acc + Math.pow(elem - avg, 2), 0) /
      allGrades.length
    return Math.sqrt(sum)
  }

  private showMore = () => {
    this.setState({
      expanded: true,
    })
  }

  private showLess = () => {
    if (!this.answerRef.current) {
      return
    }
    scrollTo({
      left: 0,
      top: this.answerRef.current.offsetTop - 100,
      behavior: "smooth",
    })
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
    if (this.props.peerReviewsQuestions.length === 0) {
      return (
        <Grid item={true} xs="auto">
          <Typography variant="title">Quiz involves no peer reviews</Typography>
        </Grid>
      )
    }

    return (
      <Grid item={true} xs={12} style={{ margin: "0em 0em 1em 1em" }}>
        <Grid
          container={true}
          justify="flex-start"
          alignItems="stretch"
          spacing={8}
        >
          <Grid item={true} xs={12} style={{ textAlign: "center" }}>
            <Typography variant="subtitle1">
              Status:{` ${this.props.answer.status}`}
            </Typography>
          </Grid>
          <Grid
            item={true}
            xs={12}
            md={3}
            style={{ borderRight: "1px dashed #9D9696" }}
          >
            <Grid
              container={true}
              direction="column"
              spacing={24}
              justify="space-around"
              alignItems="center"
            >
              <Grid item={true} xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  SPAM FLAGS:{" "}
                  {this.props.answer.userQuizState &&
                  typeof this.props.answer.userQuizState.spamFlags === "number"
                    ? this.props.answer.userQuizState.spamFlags
                    : "Not calculated (likely old data)"}
                  {this.props.course.maxSpamFlags &&
                    `. (Maximum allowed: ${this.props.course.maxSpamFlags})`}
                </Typography>
              </Grid>
              <Grid item={true} xs={12}>
                <Typography variant="body1">
                  Peer reviews given:{" "}
                  {this.props.answer.userQuizState
                    ? this.props.answer.userQuizState.peerReviewsGiven
                    : "not calculated"}
                  {this.props.course.minPeerReviewsGiven &&
                    `. (Required: ${this.props.course.minPeerReviewsGiven})`}
                </Typography>
              </Grid>

              <Grid item={true} xs={12}>
                <Typography variant="body1">
                  Peer reviews received: {this.props.peerReviewsAnswers.length}
                  {this.props.course.minPeerReviewsReceived &&
                    `. (Required: ${this.props.course.minPeerReviewsReceived})`}
                </Typography>
              </Grid>

              {this.props.course.minReviewAverage && (
                <Grid item={true} xs={12}>
                  <Typography variant="body1">
                    Minimum average of peer reviews:{" "}
                    {this.props.course.minReviewAverage || "not set"}
                  </Typography>
                </Grid>
              )}

              <Grid item={true} xs={12}>
                <Button variant="outlined" onClick={this.openModal}>
                  VIEW PEER REVIEWS
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item={true} xs={12} md={9}>
            <Grid
              container={true}
              alignItems="center"
              spacing={8}
              style={{ paddingLeft: "1em", paddingBottom: "1em" }}
            >
              <Grid item={true} xs={4} lg={6} />
              <Grid item={true} xs={4} lg={3}>
                <Typography variant="subtitle1">AVERAGE POINTS</Typography>
              </Grid>
              <Grid item={true} xs={4} lg={3}>
                <Typography variant="subtitle1">STANDARD DEVIATION</Typography>
              </Grid>

              {this.props.peerReviewsAnswers &&
                (this.props.peerReviewsAnswers.length === 0 ||
                  this.props.peerReviewsAnswers[0].quizAnswerId ===
                    this.props.answer.id) &&
                this.props.peerReviewsQuestions.map((question, idx) => {
                  const average = this.averagePoints(
                    this.props.peerReviewsAnswers,
                    idx,
                  )

                  const sd = this.standardDeviation(
                    this.props.peerReviewsAnswers,
                    idx,
                  )

                  return (
                    <React.Fragment key={question.id}>
                      <Grid item={true} xs={4} lg={6}>
                        {question.texts[0].title ||
                          (question.type === "essay"
                            ? "Written review"
                            : "No title")}
                      </Grid>
                      <Grid item={true} xs={4} lg={3}>
                        {question.type === "essay"
                          ? "NA"
                          : average === undefined
                          ? "-"
                          : average.toFixed(2)}
                      </Grid>
                      <Grid item={true} xs={4} lg={3}>
                        {question.type === "essay"
                          ? "NA"
                          : sd === undefined
                          ? "-"
                          : sd.toFixed(2)}
                      </Grid>
                    </React.Fragment>
                  )
                })}
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

  private averagePoints = (
    prAnswers: any[],
    questionIdx: number,
  ): number | undefined => {
    const scores = prAnswers.map(a => a.answers[questionIdx].value)
    if (scores.length === 0) {
      return undefined
    }

    return scores.reduce((acc, score) => acc + score, 0) / scores.length
  }

  private standardDeviation = (
    prAnswers: any[],
    questionIdx: number,
  ): number | undefined => {
    const scores = prAnswers.map(a => a.answers[questionIdx].value)
    if (scores.length === 0) {
      return undefined
    }
    const average = this.averagePoints(prAnswers, questionIdx)
    if (average === undefined) {
      return undefined
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
    quizzes: state.quizzes.courseInfos.find(
      qi => qi.courseId === state.filter.course,
    ).quizzes,
    courses: state.courses,
    filter: state.filter,
    user: state.user,
  }
}

export default connect(mapStateToProps, {
  decrementAttentionCount: decrement,
  displayMessage,
  setQuiz,
})(Answer)

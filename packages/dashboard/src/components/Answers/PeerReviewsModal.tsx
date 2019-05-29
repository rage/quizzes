import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { setQuiz } from "../../store/filter/actions"
import { setPeerReviews } from "../../store/peerReviews/actions"

class PeerReviewsModal extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    const answer = this.props.answer
    this.props.setQuiz(answer.quizId)
    this.props.setPeerReviews(answer.id)
  }

  public render() {
    if (this.props.peerReviews == null) {
      return <div />
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="peer-reviews-modal-titlModal,e"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="body1" id="peer-reviews-modal-title">
            Received peer reviews ({this.props.peerReviews.length})
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container={true} spacing={16}>
            {this.props.peerReviews !== null &&
              this.props.peerReviews.map((pr, idx) => (
                <Grid item={true} xs={12} key={pr.id}>
                  <PeerReview
                    peerReviewAnswer={pr}
                    idx={idx}
                    peerReviewQuestions={
                      this.props.quizzes.find(
                        q => q.id === this.props.answer.quizId,
                      ).peerReviewCollections[0]
                    }
                  />
                </Grid>
              ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onClose}>close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const PeerReview = ({ idx, peerReviewAnswer, peerReviewQuestions }) => {
  console.log("Peer review quetions", peerReviewQuestions)
  return (
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Typography variant="body1">Peer review {idx + 1}</Typography>
      </Grid>
      <Grid item={true} xs={12} style={{ backgroundColor: "silver" }}>
        <Grid container={true} spacing={16}>
          <Grid
            item={true}
            xs={12}
            style={{ borderBottom: "1px dashed black" }}
          >
            <Typography variant="subtitle1">
              {peerReviewQuestions.texts[0].title}
            </Typography>
            <Typography variant="body1">
              {" "}
              {peerReviewQuestions.texts[0].body}
            </Typography>
          </Grid>

          {peerReviewAnswer.answers.map((answer, answerIdx) => {
            return (
              <React.Fragment key={answerIdx}>
                <Grid item={true} xs={12}>
                  (Title){" "}
                  {peerReviewQuestions.questions[answerIdx].texts[0].title} :
                </Grid>
                <Grid item={true} xs={12}>
                  {answer.value === null ? (
                    <Typography variant="body1">
                      {" "}
                      Written answer: {answer.text}{" "}
                    </Typography>
                  ) : (
                    <Typography variant="body1">
                      {" "}
                      Numerical answer: {answer.value}
                    </Typography>
                  )}
                </Grid>
              </React.Fragment>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = state => {
  return {
    answers: state.answers,
    peerReviews: state.peerReviews,
    quizzes: state.quizzes,
  }
}

export default connect(
  mapStateToProps,
  { setQuiz, setPeerReviews },
)(PeerReviewsModal)

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { setQuiz } from "../../store/filter/actions"

class PeerReviewsModal extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    if (!this.props.peerReviews) {
      return <div />
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="peer-reviews-modal-title"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          Received peer reviews ({this.props.peerReviews.length})
        </DialogTitle>

        <DialogContent>
          <Grid container={true} spacing={16}>
            {this.props.peerReviews !== null &&
              this.props.peerReviews.map((pr, idx) => (
                <Grid
                  item={true}
                  xs={12}
                  key={pr.id}
                  style={{ marginBottom: "1em" }}
                >
                  <PeerReview
                    peerReviewAnswer={pr}
                    idx={idx}
                    peerReviewQuestions={
                      this.props.quizzes.find(
                        q => q.id === this.props.answer.quizId,
                      ).peerReviewCollections[0]
                    }
                    peerReviewTitle={extractCommonEnding(
                      this.props.quizzes
                        .find(q => q.id === this.props.answer.quizId)
                        .peerReviewCollections.map(prc => prc.texts[0].title),
                    )}
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

const PeerReview = ({
  idx,
  peerReviewAnswer,
  peerReviewQuestions,
  peerReviewTitle,
}) => {
  return (
    <Grid container={true} spacing={16}>
      <Grid item={true} xs={12}>
        <Typography variant="subheading">Peer review {idx + 1}</Typography>
      </Grid>
      <Grid item={true} xs={12} style={{ backgroundColor: "#DDDDDD" }}>
        <Grid container={true} spacing={16}>
          <Grid
            item={true}
            xs={12}
            style={{ borderBottom: "1px dashed black" }}
          >
            <Typography variant="subtitle1">
              {
                // peerReviewQuestions.texts[0].title
                peerReviewTitle
              }
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
                  <PeerReviewQuestionAnswer
                    type={peerReviewQuestions.questions[answerIdx].type}
                    questionAnswer={answer}
                    title={
                      peerReviewQuestions.questions[answerIdx].texts[0].title ||
                      "No title"
                    }
                  />
                </Grid>
              </React.Fragment>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

const extractCommonEnding = (strings: string[]): string => {
  if (strings.length === 0) {
    return ""
  } else if (strings.length === 1) {
    return strings[0]
  }

  let shortest = 1000
  strings.forEach(
    str => (shortest = str.length < shortest ? str.length : shortest),
  )

  for (let i = 0; i < shortest; i++) {
    let first = strings[0].substring(i)

    if (strings.every(str => str.substring(i) === first)) {
      while (
        first.length > 0 &&
        (first.charAt(0) === " " || first.charAt(0) === ":")
      ) {
        first = first.substring(1)
      }
      return first
    }
  }

  return ""
}

const PeerReviewQuestionAnswer = ({ type, questionAnswer, title }) => {
  if (type === "essay") {
    return (
      <React.Fragment>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1" style={{ wordBreak: "break-word" }}>
          {questionAnswer.text}
        </Typography>
      </React.Fragment>
    )
  } else if (type === "grade") {
    return (
      <FormControl>
        <FormLabel>{title}</FormLabel>
        <RadioGroup value={`${questionAnswer.value}`} row={true}>
          {[1, 2, 3, 4, 5].map(n => {
            return (
              <FormControlLabel
                key={"radio" + n}
                value={`${n}`}
                label={n}
                labelPlacement="start"
                control={<Radio color="primary" disabled={true} />}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
    )
  } else {
    return <div>Unknown / unsupported peer review question type</div>
  }
}

const mapStateToProps = state => {
  return {
    answers: state.answers,
    quizzes: state.quizzes,
  }
}

export default connect(
  mapStateToProps,
  { setQuiz },
)(PeerReviewsModal)

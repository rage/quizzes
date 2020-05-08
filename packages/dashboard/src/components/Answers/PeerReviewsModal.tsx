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
        <Typography variant="headline">Peer review {idx + 1}</Typography>
      </Grid>
      <Grid item={true} xs={12} style={{ backgroundColor: "#DDDDDD" }}>
        <Grid container={true} spacing={16}>
          <Grid item={true} xs={12} style={{ borderBottom: "1px solid black" }}>
            <Typography variant="subtitle1">{peerReviewTitle}</Typography>
            <Typography variant="body1">
              {" "}
              {peerReviewQuestions.texts[0].body}
            </Typography>
          </Grid>

          {peerReviewQuestions.questions.map(question => {
            const answer = peerReviewAnswer.answers.find(
              pra => pra.peerReviewQuestionId === question.id,
            )

            return (
              <Grid item={true} xs={12} key={question.id}>
                <PeerReviewQuestionAnswer
                  type={question.type}
                  questionAnswer={answer}
                  title={
                    question.texts[0].title ||
                    (question.type === "essay" ? "Written review" : "No title")
                  }
                />
              </Grid>
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
        <Typography variant="subheading">{title}</Typography>
        <Typography variant="body1" style={{ wordBreak: "break-word" }}>
          {questionAnswer.text}
        </Typography>
      </React.Fragment>
    )
  } else if (type === "grade") {
    return (
      <FormControl fullWidth={true}>
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
    answers: state.answers.data,
    quizzes: state.quizzes.courseInfos.find(
      qi => qi.courseId === state.filter.course,
    ).quizzes,
  }
}

export default connect(
  mapStateToProps,
  { setQuiz },
)(PeerReviewsModal)

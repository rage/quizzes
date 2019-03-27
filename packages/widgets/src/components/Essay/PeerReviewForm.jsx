import React, { Component } from "react"
import LikertScale from "likert-react"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import PeerReviewOption from "./PeerReviewOption"

const PeerReviewForm = ({
  answersToReview,
  languageInfo,
  peerReview,
  peerReviewQuestions,
  handlePeerReviewGradeChange,
  submitLocked,
  submitPeerReview,
  flagAsSpam,
  selectAnswer,
  quizItems,
  submitDisabled,
}) => (
  <React.Fragment>
    <Typography variant="subtitle1">
      Valitse yksi vaihtoehdoista vertaisarvoitavaksi
    </Typography>
    {!answersToReview ? (
      <Grid container>
        <Grid item xs={1}>
          <CircularProgress size={25} />
        </Grid>
        <Grid item>
          <Typography>{languageInfo.loadingLabel}</Typography>
        </Grid>
      </Grid>
    ) : answersToReview.length === 0 ? (
      <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
    ) : (
      answersToReview.map(answer => (
        <div key={answer.id}>
          <PeerReviewOption answer={answer} quizItems={quizItems} />

          {peerReview ? (
            <div>
              {peerReviewQuestions[0].questions.map(question => {
                return (
                  <LikertScale
                    key={question.id}
                    reviews={[{ question: question.texts[0].title }]}
                    onClick={handlePeerReviewGradeChange(question.id)}
                  />
                )
              })}
              <Button
                disabled={submitLocked ? true : submitDisabled}
                onClick={submitPeerReview}
              >
                {languageInfo.submitPeerReviewLabel}
              </Button>
            </div>
          ) : (
            <Grid container>
              <Grid item xs={3}>
                <Button onClick={flagAsSpam(answer.id)}>
                  {languageInfo.reportAsInappropriateLabel}
                </Button>
              </Grid>
              <Grid item xs={8} />
              <Grid item xs={1}>
                <Button onClick={selectAnswer(answer.id)}>
                  {languageInfo.choosePeerEssayLabel}
                </Button>
              </Grid>
            </Grid>
          )}
        </div>
      ))
    )}
  </React.Fragment>
)

class TogglableForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
    }
  }

  toggleVisibility = event => {
    event.preventDefault()
    this.setState({ visible: !this.state.visible })
    console.log("Clicked!")
    console.log("Status: ", this.state.visible)
  }

  render = () => {
    if (this.state.visible) {
      return (
        <React.Fragment>
          <Button onClick={this.toggleVisibility}>Piilota vertaisarviot</Button>
          <PeerReviewForm {...this.props} />
        </React.Fragment>
      )
    }

    return <Button onClick={this.toggleVisibility}>Tee vertaisarvio</Button>
  }
}

export default TogglableForm

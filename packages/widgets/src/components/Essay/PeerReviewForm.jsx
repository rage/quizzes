import React from "react"
import LikertScale from "likert-react"
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core"

const paper = {
  padding: 10,
  margin: 10,
}

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
}) => (
  <React.Fragment>
    <Typography variant="subtitle1">
      Valitse yksi vaihtoehdoista vertaisarvoitavaksi
    </Typography>
    {!answersToReview ? (
      <Typography>
        {languageInfo.loadingLabel}
        {languageInfo.loadingLabel}
      </Typography>
    ) : answersToReview.length === 0 ? (
      <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
    ) : (
      answersToReview.map(answer => (
        <div key={answer.id}>
          <Paper style={paper}>
            <Typography variant="body1">
              {answer.itemAnswers[0].textData}
            </Typography>
          </Paper>
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

export default PeerReviewForm

import React from "react"
import { Typography, Paper } from "@material-ui/core"
import PeerReviews from "./PeerReviews"

const paper = {
  padding: 10,
  margin: 10,
}

const PeerReviewStageContainer = ({
  languageInfo,
  textData,
  submitMessage,
  answered,
  ...other
}) => (
  <div>
    <Typography variant="subtitle1">{languageInfo.userAnswerLabel}</Typography>
    <Paper style={paper}>
      <Typography variant="body1">{textData}</Typography>
    </Paper>
    {submitMessage ? (
      <div>
        <Typography variant="subtitle1">
          {languageInfo.exampleAnswerLabel}
        </Typography>
        <Paper style={paper}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: submitMessage }}
          />
        </Paper>
      </div>
    ) : (
      ""
    )}
    <PeerReviews {...other} answered={answered} languageInfo={languageInfo} />
  </div>
)

export default PeerReviewStageContainer

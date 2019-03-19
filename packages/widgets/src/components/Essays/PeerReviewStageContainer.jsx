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
  quizAnswer,
  quiz,
  ...other
}) => {
  const ownAnswers = quizAnswer.itemAnswers
    .sort((e1, e2) => {
      const qi1 = quiz.items.find(qi => qi.id === e1.quizItemId)
      const qi2 = quiz.items.find(qi => qi.id === e2.quizItemId)
      return qi1.order - qi2.order
    })
    .map(ia => {
      const quizItem = quiz.items.find(qi => qi.id === ia.quizItemId)
      if (quizItem.type !== "essay") {
        return ""
      }

      return (
        <React.Fragment key={ia.id}>
          <Typography variant="subtitle1">
            {languageInfo.userAnswerLabel + ": "}
            {quizItem.texts[0] && quizItem.texts[0].title}
          </Typography>
          <Paper style={paper}>
            <Typography variant="body1">{ia.textData}</Typography>
          </Paper>
        </React.Fragment>
      )
    })

  return (
    <div>
      {ownAnswers}
      {submitMessage && (
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
      )}

      <PeerReviews
        {...other}
        answered={answered}
        languageInfo={languageInfo}
        quiz={quiz}
      />
    </div>
  )
}

export default PeerReviewStageContainer

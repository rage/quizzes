import React from "react"
import StageVisualizer from "./Essay/StageVisualizer"
import EssayStageContainer from "./Essay/EssayStageContainer"
import PeerReviews from "./Essay/PeerReviews"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Essay from "./Essay"

const EssayContainer = props => {
  const paper = {
    padding: 10,
    margin: 10,
  }

  return (
    <div>
      <StageVisualizer {...props} />
      {props.quizAnswer.id ? (
        <React.Fragment>
          {props.quizAnswer.itemAnswers.map(ia => {
            const quizItem = props.quiz.items.find(
              qi => qi.id === ia.quizItemId,
            )

            return (
              <React.Fragment key={ia.id}>
                <Typography variant="subtitle1">
                  {quizItem.texts[0].title + ": "}
                  {props.languageInfo.userAnswerLabel}
                </Typography>
                <Paper style={paper}>
                  <Typography variant="body1">{ia.textData}</Typography>
                </Paper>
              </React.Fragment>
            )
          })}
          <PeerReviews
            quizId={props.quiz.id}
            accessToken={props.accessToken}
            languageId={props.quiz.languageId}
            languageInfo={props.languageInfo}
            answered={props.quizAnswer.id ? true : false}
            peerReviewsGiven={props.peerReviewsGiven}
            peerReviewsRequired={props.quiz.course.minPeerReviewsGiven}
            peerReviewQuestions={props.quiz.peerReviewCollections}
            submitMessage={props.quiz.texts[0].submitMessage}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {props.quiz.items.map(qi => {
            const itemAnswer = props.quizAnswer.itemAnswers.find(
              ia => ia.quizItemId === qi.id,
            )
            if (qi.type !== "essay") {
              return <React.Fragment key={itemAnswer.id} />
            }
            console.log("Quiz item:", qi)

            return (
              <div key={qi.id}>
                <h2>{qi.texts[0].title}</h2>
                <div>{qi.texts[0].body}</div>
                <EssayStageContainer
                  textData={itemAnswer.textData}
                  handleTextDataChange={props.handleTextDataChange(qi.id)}
                />
              </div>
            )
          })}
        </React.Fragment>
      )}
    </div>
  )
}

export default EssayContainer

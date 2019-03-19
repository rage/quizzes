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

  const essays = props.quiz.items.filter(item => item.type === "essay")

  const ownAnswers = props.quizAnswer.itemAnswers.map(ia => {
    const quizItem = props.quiz.items.find(qi => qi.id === ia.quizItemId)

    return (
      <React.Fragment key={ia.id}>
        <Typography variant="subtitle1">
          {quizItem.texts[0] && quizItem.texts[0].title + ": "}
          {props.languageInfo.userAnswerLabel}
        </Typography>
        <Paper style={paper}>
          <Typography variant="body1">{ia.textData}</Typography>
        </Paper>
      </React.Fragment>
    )
  })

  return (
    <div>
      <h2>Essays</h2>
      <StageVisualizer {...props} />

      {props.answered ? (
        <React.Fragment>
          {ownAnswers}

          {props.quiz.texts[0].submitMessage && (
            <div>
              <Typography variant="subtitle1">
                {props.languageInfo.exampleAnswerLabel}
              </Typography>
              <Paper style={paper}>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: props.quiz.texts[0].submitMessage,
                  }}
                />
              </Paper>
            </div>
          )}

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
        // not answered? follows below

        <React.Fragment>
          {essays.map(qi => {
            const itemAnswer = props.quizAnswer.itemAnswers.find(
              ia => ia.quizItemId === qi.id,
            )

            return (
              <div key={qi.id}>
                <Typography variant="h6" style={{ paddingBottom: 10 }}>
                  {qi.texts[0].title}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ paddingBottom: 10 }}
                  dangerouslySetInnerHTML={{ __html: qi.texts[0].body }}
                />
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

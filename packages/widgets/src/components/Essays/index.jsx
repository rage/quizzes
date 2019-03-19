import React from "react"
import StageVisualizer from "./StageVisualizer"
import EssayStageContainer from "./EssayStageContainer"
import PeerReviewStageContainer from "./PeerReviews"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import StageSelector from "./StageSelector"

export default props => {
  const paper = {
    padding: 10,
    margin: 10,
  }

  const essays = props.quiz.items.filter(item => item.type === "essay")

  return (
    <div>
      <h2>Essays</h2>
      <StageVisualizer {...props} />
      <StageSelector
        {...props}
        quizId={props.quiz.id}
        languageId={props.quiz.languageId}
        essays={essays}
        itemAnswers={props.quizAnswer.items}
      />
    </div>
  )
}

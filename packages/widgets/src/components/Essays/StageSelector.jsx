import React from "react"
import PeerReviewStageContainer from "./PeerReviewStageContainer"
import EssaysStageContainer from "./EssaysStageContainer"

const StageSelector = props => {
  if (props.answered) {
    return (
      <PeerReviewStageContainer
        {...props}
        submitMessage={props.quiz.texts[0].submitMessage}
      />
    )
  }

  return (
    <EssaysStageContainer
      {...props}
      itemAnswers={props.quizAnswer.itemAnswers}
    />
  )
}

export default StageSelector

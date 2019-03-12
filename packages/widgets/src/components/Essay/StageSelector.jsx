import React from "react"
import PeerReviewStageContainer from "./PeerReviewStageContainer"
import EssayStageContainer from "./EssayStageContainer"

const StageSelector = props => {
  if (props.answered) {
    return <PeerReviewStageContainer {...props} />
  }
  return <EssayStageContainer {...props} />
}

export default StageSelector

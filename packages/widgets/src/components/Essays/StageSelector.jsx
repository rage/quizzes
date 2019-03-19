import React from "react"
import PeerReviewStageContainer from "./PeerReviewStageContainer"
import EssaysStageContainer from "./EssayStageContainer"

const StageSelector = props => {
  if (props.answered) {
    return <PeerReviewStageContainer {...props} />
  }
  return <EssaysStageContainer {...props} />
}

export default StageSelector

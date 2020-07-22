import React from "react"
import { Answer } from "../../../types/Answer"
import { Typography } from "@material-ui/core"

export interface CompactStatProps {
  answer: Answer
}

export const CompactPeerReviewStats = ({ answer }: CompactStatProps) => {
  return (
    <>
      {answer.userQuizState ? (
        <Typography>
          Peerreviews(given:{answer.userQuizState.peerReviewsGiven}, received:
          {answer.userQuizState.peerReviewsReceived})
        </Typography>
      ) : (
        <Typography>No Stats</Typography>
      )}
    </>
  )
}

export default CompactPeerReviewStats

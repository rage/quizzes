import React from "react"
import { PeerReview } from "../../../types/Answer"

export interface PeerReviewStatsProps {
  peerReviews: PeerReview[]
}

export const PeerReviewStats = ({ peerReviews }: PeerReviewStatsProps) => {
  return <>Peerreview Statistics</>
}

export default PeerReviewStats

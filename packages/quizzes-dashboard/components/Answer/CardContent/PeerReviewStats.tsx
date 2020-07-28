import React from "react"
import { PeerReview } from "../../../types/Answer"
import Peerreviews from "./Peerreviews"
import { Typography } from "@material-ui/core"
import styled from "styled-components"

export const TitleContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  width: 100%;
`

export interface PeerReviewStatsProps {
  peerReviews: PeerReview[]
}

export const PeerReviewStats = ({ peerReviews }: PeerReviewStatsProps) => {
  return (
    <>
      <TitleContainer>
        <Typography variant="h5">Peerreviews</Typography>
      </TitleContainer>
      <Peerreviews peerreviews={peerReviews} />
    </>
  )
}

export default PeerReviewStats

import React from "react"
import { PeerReview } from "../../../../types/Answer"
import Review from "./Review"
import styled from "styled-components"
import { Divider } from "@material-ui/core"

export const PeerreviewWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
`

export const StyledDivider = styled(Divider)`
  display: flex;
  color: blue !important;
  margin: 0.5rem !important;
`

export interface peerreviewProps {
  peerreviews: PeerReview[]
}

export const Peerreviews = ({ peerreviews }: peerreviewProps) => {
  return (
    <>
      <PeerreviewWrapper>
        {peerreviews.map(review => (
          <div key={review.id}>
            <Review review={review} />
            <StyledDivider variant="fullWidth" />
          </div>
        ))}
      </PeerreviewWrapper>
    </>
  )
}

export default Peerreviews

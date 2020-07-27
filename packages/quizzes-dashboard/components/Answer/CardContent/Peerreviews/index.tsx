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

export interface peerreviewProps {
  peerreviews: PeerReview[]
}

export const Peerreviews = ({ peerreviews }: peerreviewProps) => {
  return (
    <>
      <PeerreviewWrapper>
        {peerreviews.map((review, index) => (
          <Review key={review.id} review={review} number={index + 1} />
        ))}
      </PeerreviewWrapper>
    </>
  )
}

export default Peerreviews

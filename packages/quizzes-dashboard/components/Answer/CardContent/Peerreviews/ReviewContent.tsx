import React from "react"
import { PeerReview } from "../../../../types/Answer"
import styled from "styled-components"
import { Typography, Divider } from "@material-ui/core"
import { DateTime } from "luxon"
import ReviewAnswerElement from "./AnswerElement"

export const PeerreviewContainer = styled.div`
  display: flex;
  width: 100%;
  background: #bdbdbd;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

export const StyledReviewer = styled(Typography)`
  display: flex;
  width: 100%;
`

export const StyledCreatedAt = styled(Typography)`
  display: flex;
  width: 100%;
`

export interface ContentProps {
  review: PeerReview
}

export const ReviewContent = ({ review }: ContentProps) => {
  return (
    <>
      <PeerreviewContainer>
        <StyledReviewer>reviewer: {review.userId}</StyledReviewer>
        <StyledCreatedAt>
          created at:{" "}
          {DateTime.fromISO(review.createdAt)
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT)}
        </StyledCreatedAt>
        {review.answers.map(reviewAnswer => (
          <ReviewAnswerElement
            key={reviewAnswer.peerReviewId}
            answerElement={reviewAnswer}
          />
        ))}
      </PeerreviewContainer>
    </>
  )
}

export default ReviewContent

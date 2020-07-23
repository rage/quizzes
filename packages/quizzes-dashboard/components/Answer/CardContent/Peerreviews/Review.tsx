import React from "react"
import { PeerReview } from "../../../../types/Answer"
import { Typography, Divider } from "@material-ui/core"
import ReviewAnswerElement from "./AnswerElement"
import styled from "styled-components"
import { DateTime } from "luxon"

export const PeerreviewContainer = styled.div`
  display: flex;
`

export const StyledReviewer = styled(Typography)`
  display: flex;
  margin-right: 0.5rem !important;
`

export const StyledCreatedAt = styled(Typography)`
  display: flex;
  margin-left: 0.5rem !important;
`

export interface reviewProps {
  review: PeerReview
}

export const Review = ({ review }: reviewProps) => {
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
      </PeerreviewContainer>
      {review.answers.map(reviewAnswer => (
        <ReviewAnswerElement
          key={reviewAnswer.peerReviewQuestionId}
          answerElement={reviewAnswer}
        />
      ))}
    </>
  )
}

export default Review

import React from "react"

import styled from "styled-components"

import { Typography, Divider } from "@mui/material"

import { PeerReview } from "../../../../types/Answer"
import ReviewContent from "./ReviewContent"

export const StyledDivider = styled(Divider)`
  display: flex !important;
  color: blue !important;
  margin: 0.5rem !important;
  width: 100%;
`

export const ReviewContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
  flex-wrap: wrap;
`

export const StyledTitle = styled(Typography)`
  display: flex !important;
  margin-top: 2rem !important;
`

export interface reviewProps {
  review: PeerReview
  number: number
}

export const Review = ({ review, number }: reviewProps) => {
  return (
    <>
      <ReviewContainer>
        <StyledTitle variant="h3">Review nro. {number}</StyledTitle>
        <ReviewContent review={review} />
      </ReviewContainer>
    </>
  )
}

export default Review

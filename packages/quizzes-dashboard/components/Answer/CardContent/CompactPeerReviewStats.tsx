import React from "react"
import { Answer } from "../../../types/Answer"
import { Typography } from "@material-ui/core"
import _ from "lodash"
import styled from "styled-components"

export const StyledOneLiner = styled(Typography)`
  display: flex !important;
  padding: 1rem;
`

export interface CompactStatProps {
  answer: Answer
}

export const CompactPeerReviewStats = ({ answer }: CompactStatProps) => {
  let average = 0
  let sd = 0
  if (answer.peerReviews && answer.peerReviews.length > 0) {
    const answerElementValues = answer.peerReviews
      .map(review => review.answers)
      .reduce((prev, next) => prev.concat(next))
      .map(elem => elem.value)

    average =
      answerElementValues.reduce((prev, next) => prev + next) /
      answerElementValues.length

    sd = Math.sqrt(
      answerElementValues
        .map(value => Math.pow(value - average, 2))
        .reduce((prev, next) => prev + next, 0) / answerElementValues.length,
    )
  }
  return (
    <>
      {answer.userQuizState ? (
        <StyledOneLiner variant="overline">
          Peerreviews(given: {answer.userQuizState.peerReviewsGiven}, received:{" "}
          {answer.userQuizState.peerReviewsReceived}, avg: {average.toFixed(3)},
          sd: {sd.toFixed(3)})
        </StyledOneLiner>
      ) : (
        <StyledOneLiner variant="overline">No Stats</StyledOneLiner>
      )}
    </>
  )
}

export default CompactPeerReviewStats

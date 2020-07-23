import React, { useState, useEffect } from "react"
import styled from "styled-components"
import AnswerOverView from "./AnswerOverView"
import ItemAnswers from "./ItemAnswers"
import PeerReviewStats from "./PeerReviewStats"
import { Answer } from "../../../types/Answer"
import CompactPeerReviewStats from "./CompactPeerReviewStats"
import { Button, Collapse } from "@material-ui/core"
import AnswerLink from "./AnswerLink"
import ManualReviewField from "./ManualReviewField"

export const ContentContainer = styled.div`
  display: flex !important;
  margin-top: 1rem;
  justify-content: space-between !important;
  width: 100%;
`

export const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`

export const StatButtonWrapper = styled.div`
  display: flex;
  justify-content: center !important;
  width: 100%;
`

export interface AnswerContentProps {
  answer: Answer
  expanded: boolean
}

export const AnswerContent = ({ answer, expanded }: AnswerContentProps) => {
  const [showMore, setShowMore] = useState(expanded)

  useEffect(() => setShowMore(expanded), [expanded])

  return (
    <>
      <Collapse in={showMore} collapsedHeight={250}>
        <ContentContainer>
          <AnswerLink answer={answer} />
        </ContentContainer>
        <ContentContainer>
          <AnswerOverView answer={answer} />
        </ContentContainer>
        <ContentContainer>
          <ItemAnswers itemAnswers={answer.itemAnswers} />
        </ContentContainer>
      </Collapse>
      <StatsContainer>
        {showMore ? (
          <PeerReviewStats peerReviews={answer.peerReviews} />
        ) : (
          <CompactPeerReviewStats answer={answer} />
        )}
      </StatsContainer>
      <StatButtonWrapper>
        {showMore ? (
          <Button variant="outlined" onClick={() => setShowMore(false)}>
            Show Less
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => setShowMore(true)}>
            Show More
          </Button>
        )}
      </StatButtonWrapper>
      {answer.status === "confirmed" ? (
        <ManualReviewField answer={answer} />
      ) : (
        ""
      )}
    </>
  )
}

export default AnswerContent

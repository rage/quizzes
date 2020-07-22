import React, { useState } from "react"
import styled from "styled-components"
import AnswerOverView from "./AnswerOverView"
import ItemAnswers from "./ItemAnswers"
import PeerReviewStats from "./PeerReviewStats"
import { Answer } from "../../../types/Answer"
import CompactPeerReviewStats from "./CompactPeerReviewStats"
import { Button, Typography, Collapse } from "@material-ui/core"
import Link from "next/link"
import AnswerLink from "./AnswerLink"

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
`

export const StatButtonWrapper = styled.div`
  display: flex;
  justify-content: center !important;
  margin-top: 1rem;
  width: 100%;
`

export interface AnswerContentProps {
  answer: Answer
}

export const AnswerContent = ({ answer }: AnswerContentProps) => {
  const [showMore, setShowMore] = useState(false)

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
    </>
  )
}

export default AnswerContent

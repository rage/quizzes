import React, { useState } from "react"
import styled from "styled-components"
import AnswerOverView from "./AnswerOverView"
import ItemAnswers from "./ItemAnswers"
import PeerReviewStats from "./PeerReviewStats"
import { Answer } from "../../../types/Answer"
import CompactPeerReviewStats from "./CompactPeerReviewStats"
import { Button } from "@material-ui/core"

export const ContentContainer = styled.div`
  display: flex !important;
  margin-top: 1rem;
  justify-content: space-between !important;
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
      <ContentContainer>
        <AnswerOverView answer={answer} />
      </ContentContainer>
      <ContentContainer>
        <ItemAnswers itemAnswers={answer.itemAnswers} />
      </ContentContainer>
      <ContentContainer>
        {showMore ? (
          <PeerReviewStats peerReviews={answer.peerReviews} />
        ) : (
          <CompactPeerReviewStats answer={answer} />
        )}
      </ContentContainer>
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

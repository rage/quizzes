import React, { useState, useEffect } from "react"
import styled from "styled-components"
import AnswerOverView from "./AnswerOverView"
import ItemAnswers from "./ItemAnswers"
import { Answer } from "../../../types/Answer"
import CompactPeerReviewStats from "./CompactPeerReviewStats"
import {
  Button,
  Collapse,
  Typography,
  Fade,
  Box,
  Modal,
} from "@material-ui/core"
import AnswerLink from "./AnswerLink"
import ManualReviewField from "./ManualReviewField"
import Peerreviews from "./Peerreviews"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"

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
  width: 100%;
`

export const PeerreviewButton = styled(Button)`
  display: flex !important;
  margin: 0.5rem !important;
`

const PeerreviewBox = styled(Box)`
  display: flex !important;
  background-color: #fafafa;
  max-width: 50% !important;
  max-height: 80% !important;
`

const ModalContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`
const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
  padding: 1rem;
  width: 100%;
`

const CloseButton = styled(Button)`
  display: flex !important;
`

const PeerreviewModal = styled(Modal)`
  display: flex !important;
  align-items: center;
  justify-content: center;
`

export interface AnswerContentProps {
  answer: Answer
  expanded: boolean
}

export const AnswerContent = ({ answer, expanded }: AnswerContentProps) => {
  const [showMore, setShowMore] = useState(expanded)
  const [showPeerreviewModal, setShowPeerreviewModal] = useState(false)

  useEffect(() => setShowMore(expanded), [expanded])

  return (
    <>
      <PeerreviewModal
        open={showPeerreviewModal}
        onClose={() => setShowPeerreviewModal(false)}
      >
        <Fade in={showPeerreviewModal}>
          <PeerreviewBox>
            <ModalContentContainer>
              <CloseButtonWrapper>
                <CloseButton onClick={() => setShowPeerreviewModal(false)}>
                  <FontAwesomeIcon icon={faWindowClose} size="2x" />
                </CloseButton>
              </CloseButtonWrapper>
              <Peerreviews peerreviews={answer.peerReviews} />
            </ModalContentContainer>
          </PeerreviewBox>
        </Fade>
      </PeerreviewModal>
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
        <PeerreviewButton
          variant="outlined"
          title=":D"
          onClick={() => setShowPeerreviewModal(true)}
        >
          <Typography variant="subtitle2">Show Peerreviews</Typography>
        </PeerreviewButton>
      </Collapse>
      <StatsContainer>
        <CompactPeerReviewStats answer={answer} />
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
      {answer.status === "manual-review" ? (
        <ManualReviewField answer={answer} />
      ) : (
        ""
      )}
    </>
  )
}

export default AnswerContent

import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import AnswerOverView from "./AnswerOverView"
import ItemAnswers from "./ItemAnswers"
import { Answer } from "../../../types/Answer"
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
import DebugDialog from "../../DebugDialog"
import { editableAnswerStates } from "../../constants"
import { useAnswerListState } from "../../../contexts/AnswerListContext"

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
  button {
    margin: 2rem;
  }
`

export const PeerreviewButton = styled(Button)`
  display: flex !important;
  margin: 0.5rem !important;
`

const PeerreviewBox = styled(Box)`
  display: flex !important;
  background-color: #fafafa;
  max-width: 70% !important;
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

const DebugDialogWrapper = styled.div`
  display: flex;
  margin-right: 1rem;
`

export interface AnswerContentProps {
  answer: Answer
}

export const AnswerContent = ({ answer }: AnswerContentProps) => {
  const [{ expandAll, handledAnswers }] = useAnswerListState()
  const [showMore, setShowMore] = useState(expandAll)
  const [showPeerreviewModal, setShowPeerreviewModal] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowMore(expandAll)
  }, [handledAnswers, expandAll])

  useLayoutEffect(() => {
    if (ref.current !== null) {
      setHeight(ref.current.clientHeight)
    }
  }, [])

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
      <ContentContainer>
        <AnswerLink answer={answer} />
        <DebugDialogWrapper>
          <DebugDialog object={answer} />
        </DebugDialogWrapper>
      </ContentContainer>
      <ContentContainer>
        <AnswerOverView answer={answer} />
      </ContentContainer>
      <Collapse in={showMore} collapsedHeight={300}>
        <ContentContainer ref={ref}>
          <ItemAnswers itemAnswers={answer.itemAnswers} />
        </ContentContainer>
      </Collapse>
      <ContentContainer>
        {answer.peerReviews.length > 0 && (
          <PeerreviewButton
            variant="outlined"
            title=":D"
            onClick={() => setShowPeerreviewModal(true)}
          >
            <Typography variant="subtitle2">Show Peerreviews</Typography>
          </PeerreviewButton>
        )}
      </ContentContainer>
      <StatButtonWrapper>
        {height > 300 && (
          <>
            {showMore ? (
              <Button variant="outlined" onClick={() => setShowMore(false)}>
                Show Less
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setShowMore(true)}>
                Show More
              </Button>
            )}
          </>
        )}
      </StatButtonWrapper>
      {editableAnswerStates.includes(answer.status) && (
        <ManualReviewField answer={answer} />
      )}
    </>
  )
}

export default AnswerContent

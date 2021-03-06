import React from "react"
import { useTypedSelector } from "../../../store/store"
import { PeerReviewEditor } from "./PeerReviewEditor"
import { Typography, Button } from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import {
  createdNewPeerReview,
  deletePeerReview,
} from "../../../store/editor/peerReviewCollections/peerReviewCollectionActions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

const PeerReviewTitleWrapper = styled.div`
  display: flex !important;
  width: 100%;
  justify-content: center;
  margin-bottom: 1rem;
`

const StyledTypography = styled(Typography)`
  display: flex !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
`

const AddPeerReviewButton = styled(Button)`
  display: flex !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  width: 33% !important;
  background: #e0e0e0 !important;
`

const AddPeerReviewButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`

const PeerReviewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: no-wrap;
`

export const PeerReviewEditForms = () => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const peerReviews = Object.values(
    useTypedSelector(state => state.editor.peerReviewCollections),
  )

  const dispatch = useDispatch()

  return (
    <>
      <PeerReviewTitleWrapper>
        <Typography variant="h2">Peer reviews</Typography>
      </PeerReviewTitleWrapper>
      {peerReviews.map((peerReview, index) => (
        <React.Fragment key={peerReview.id}>
          <PeerReviewWrapper>
            <StyledTypography variant="h4">
              Peer review nro. {index + 1}
            </StyledTypography>
            <Button
              title="delete peer review"
              onClick={() => dispatch(deletePeerReview(peerReview.id))}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                color="red"
              ></FontAwesomeIcon>
            </Button>
          </PeerReviewWrapper>
          <PeerReviewEditor id={peerReview.id} />
        </React.Fragment>
      ))}
      <AddPeerReviewButtonWrapper>
        <AddPeerReviewButton
          variant="outlined"
          onClick={() => dispatch(createdNewPeerReview(quizId))}
        >
          <Typography variant="overline">Add new peer review</Typography>
        </AddPeerReviewButton>
      </AddPeerReviewButtonWrapper>
    </>
  )
}

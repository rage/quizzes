import React from "react"
import { useTypedSelector } from "../../../store/store"
import styled from "styled-components"
import { TextField } from "@material-ui/core"
import { useDispatch } from "react-redux"
import {
  editedPeerReviewTitle,
  editedPeerReviewBody,
} from "../../../store/editor/peerReviews/peerReviewActions"
import QuestionEditorWrapper from "./QuestionEditorForms/QuestionEditorWrapper"
import MarkdownEditor from "../../MarkdownEditor"

const PeerReviewField = styled(TextField)`
  display: flex !important;
  margin-top. 1rem !important;
  margin-bottom: 1rem !important;
`

interface PeerReviewEditorProps {
  id: string
}

export const PeerReviewEditor = ({ id }: PeerReviewEditorProps) => {
  const peerReview = useTypedSelector(state => state.editor.peerReviews[id])
  const dispatch = useDispatch()

  return (
    <>
      <PeerReviewField
        variant="outlined"
        label="Peer review title"
        value={peerReview.title}
        onChange={event => {
          dispatch(editedPeerReviewTitle(id, event.target.value))
        }}
      />
      <MarkdownEditor
        label="Peer review body"
        text={peerReview.body ?? ""}
        onChange={event => {
          dispatch(editedPeerReviewBody(id, event.target.value))
        }}
      />
      <QuestionEditorWrapper peerReviewId={id} />
    </>
  )
}

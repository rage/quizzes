import React from "react"
import { TextField, MenuItem, Button } from "@material-ui/core"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { useTypedSelector } from "../../../../store/store"
import {
  editedPeerReviewQuestionTitle,
  editedPeerReviewQuestionBody,
  editedPeerReviewQuestionType,
} from "../../../../store/editor/questions/questionActions"

const PRQWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

const PRQTextfield = styled(TextField)`
  display: flex;
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
`

interface PRQEditorProps {
  id: string
}

export const QuestionEditor = ({ id }: PRQEditorProps) => {
  const dispatch = useDispatch()
  const prq = useTypedSelector(state => state.editor.questions[id])
  return (
    <PRQWrapper>
      <PRQTextfield
        label="Question title"
        variant="outlined"
        fullWidth
        value={prq.title}
        onChange={event =>
          dispatch(editedPeerReviewQuestionTitle(event.target.value, id))
        }
      />
      <PRQTextfield
        label="Question body"
        variant="outlined"
        fullWidth
        value={prq.body}
        onChange={event =>
          dispatch(editedPeerReviewQuestionBody(event.target.value, id))
        }
      />
      <PRQTextfield
        label="Question type"
        select
        variant="outlined"
        fullWidth
        value={prq.type}
        onChange={event =>
          dispatch(editedPeerReviewQuestionType(event.target.value, id))
        }
      >
        <MenuItem value="grade">grade</MenuItem>
        <MenuItem value="essay">essay</MenuItem>
      </PRQTextfield>
    </PRQWrapper>
  )
}

import React from "react"
import { Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import { createdNewItem } from "../../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../store/store"

const StyledButton = styled(Button)`
  display: flex !important;
  background: #e0e0e0 !important;
  width: 16% !important;
  overflow: hidden !important;
`

interface ButtonProps {
  type: string
}

export const AddQuizItemButton = ({ type }: ButtonProps) => {
  const dispatch = useDispatch()
  const quizId = useTypedSelector(state => state.editor.quizId)
  return (
    <>
      <StyledButton
        title="open"
        variant="outlined"
        onClick={() => dispatch(createdNewItem(quizId, type))}
      >
        <Typography variant="button">{type}</Typography>
      </StyledButton>
    </>
  )
}

export default AddQuizItemButton

import React from "react"
import { Typography, MenuItem, Button, TextField } from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../store/store"
import { setNewItemType } from "../../store/editor/quizVariables/quizVariableActions"
import { createdNewItem } from "../../store/editor/editorActions"

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
const FormContainer = styled.div`
  display: flex;
  padding: 1rem;
`
export const AddQuizitemView = () => {
  const dispatch = useDispatch()
  const quizId = useTypedSelector(state => state.editor.quizId)
  const variables = useTypedSelector(
    state => state.editor.quizVariables[quizId],
  )

  return (
    <>
      <TitleContainer>
        <Typography variant="h3">Add new Item</Typography>
      </TitleContainer>
      <FormContainer>
        <Typography>Type</Typography>
        <TextField
          select
          variant="outlined"
          value={variables.newItemType}
          onChange={event =>
            dispatch(setNewItemType(quizId, event.target.value))
          }
        >
          <MenuItem value="essay">Essay</MenuItem>
          <MenuItem value="scale">Scale</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="custom-front-end">Custom Frontend</MenuItem>
        </TextField>
      </FormContainer>
      <Button
        variant="outlined"
        onClick={() => dispatch(createdNewItem(quizId, variables.newItemType))}
      >
        create new item
      </Button>
    </>
  )
}

export default AddQuizitemView

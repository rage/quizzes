import React from "react"
import styled from "styled-components"
import { Checkbox, Typography, TextField } from "@material-ui/core"
import { editedQuizItemTitle } from "../../../../store/editor/items/itemAction"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"

const Container = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
`

const TitleField = styled.div`
  display: flex !important;
  width: 50%;
`

const PreviewField = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
  width: 50%;
`

const StyledCheckBox = styled(Checkbox)`
  display: flex !important;
  justify-content: flex-end !important;
  width: 20% !important;
`

const CheckBoxTitleField = styled.div`
  display: flex !important;
  width: 80% !important;
`

const StyledTypo = styled(Typography)`
  display: flex !important;
  align-self: flex-start !important;
`
interface CheckBoxModalProps {
  itemId: string
}

export const CheckBoxModalContent = ({ itemId }: CheckBoxModalProps) => {
  const dispatch = useDispatch()
  const storeItem = useTypedSelector(state => state.editor.items[itemId])
  return (
    <>
      <Container>
        <TitleField>
          <TextField
            label="title"
            fullWidth
            multiline
            value={storeItem.title ?? ""}
            variant="outlined"
            onChange={event =>
              dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
            }
          />
        </TitleField>
        <PreviewField>
          <StyledCheckBox disableRipple={true} disableFocusRipple={true} />
          <CheckBoxTitleField>
            <StyledTypo>{storeItem.title}</StyledTypo>
          </CheckBoxTitleField>
        </PreviewField>
      </Container>
    </>
  )
}

export default CheckBoxModalContent

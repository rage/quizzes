import React from "react"
import styled from "styled-components"
import { TextField, Button, Modal, Box, Fade } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import {
  editedItemMaxWords,
  editedItemMinWords,
} from "../../../../store/editor/items/itemAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrash,
  faWindowClose,
  faPen,
} from "@fortawesome/free-solid-svg-icons"
import { deletedItem } from "../../../../store/editor/editorActions"
import { useTypedSelector } from "../../../../store/store"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import EssayModalContent from "./EssayModalContent"

const InfoContainer = styled.div`
  padding: 1rem 0;
`

const OneLineInfoContainer = styled.div`
  padding: 1rem 0;
  display: flex;
`

const InlineFieldWrapper = styled.div`
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
  width: 100%;
`

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AdvancedBox = styled(Box)`
  background-color: #fafafa;
  min-width: 1000px;
  min-height: 800px;
`

const CloseButton = styled(Button)`
  display: flex !important;
`

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const DeleteButton = styled(Button)`
  display: flex !important;
`
const EditItemButton = styled(Button)``

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
`

interface essayContentProps {
  item: NormalizedItem
}

const EssayContent = ({ item }: essayContentProps) => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )
  const dispatch = useDispatch()
  return (
    <>
      <EditButtonWrapper>
        <EditItemButton
          onClick={() => dispatch(setAdvancedEditing(storeItem.id, true))}
          title="edit item"
        >
          <FontAwesomeIcon icon={faPen} size="2x"></FontAwesomeIcon>
        </EditItemButton>
      </EditButtonWrapper>
      <StyledModal
        open={variables.advancedEditing}
        onClose={() => dispatch(setAdvancedEditing(storeItem.id, false))}
      >
        <Fade in={variables.advancedEditing}>
          <AdvancedBox>
            <ModalButtonWrapper>
              <CloseButton
                onClick={() =>
                  dispatch(setAdvancedEditing(storeItem.id, false))
                }
              >
                <FontAwesomeIcon icon={faWindowClose} size="2x" />
              </CloseButton>
            </ModalButtonWrapper>
            <EssayModalContent item={storeItem} />
            <ModalButtonWrapper>
              <DeleteButton
                onClick={() => {
                  dispatch(deletedItem(storeItem.id, quizId))
                }}
              >
                <FontAwesomeIcon icon={faTrash} size="2x" color="red" />
              </DeleteButton>
            </ModalButtonWrapper>
          </AdvancedBox>
        </Fade>
      </StyledModal>
      <InfoContainer>
        <TextField
          fullWidth
          variant="outlined"
          label="Description for this quiz item"
          multiline
          rows={1}
          helperText="Use this if you cannot put the description in the 'Description for the whole quiz'-field. You may want to use this if have another quiz item before this one."
          defaultValue={item.body}
        />
      </InfoContainer>
      <OneLineInfoContainer>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Max words"
            variant="outlined"
            defaultValue={item.maxWords}
            type="number"
            onChange={event =>
              dispatch(editedItemMaxWords(item.id, Number(event.target.value)))
            }
          />
        </InlineFieldWrapper>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Min words"
            variant="outlined"
            defaultValue={item.minValue}
            type="number"
            onChange={event =>
              dispatch(editedItemMinWords(item.id, Number(event.target.value)))
            }
          />
        </InlineFieldWrapper>
      </OneLineInfoContainer>
    </>
  )
}

export default EssayContent

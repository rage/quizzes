import React, { useEffect } from "react"
import styled from "styled-components"
import { TextField, Button, Modal, Box, Fade } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import {
  editedItemMaxWords,
  editedItemMinWords,
  editedQuizItemTitle,
} from "../../../../store/editor/items/itemAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrash,
  faWindowClose,
  faPen,
} from "@fortawesome/free-solid-svg-icons"
import { useTypedSelector } from "../../../../store/store"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import { checkForChanges } from "../../../../store/editor/editorActions"
import EssayModalContent from "./EssayModalContent"
import { deletedItem } from "../../../../store/editor/editorActions"
import MarkdownEditor from "../../../MarkdownEditor"

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
  background-color: #fafafa !important;
  min-width: 1000px !important;
  min-height: 800px !important;
  max-width: 1000px !important;
  max-height: 800px !important;
  overflow-y: scroll !important;
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
  console.log("💩 ~ file: index.tsx ~ line 79 ~ item", item)
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  console.log("💩 ~ file: index.tsx ~ line 81 ~ storeItem", storeItem)
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )

  const dispatch = useDispatch()

  return (
    <>
      <pre>{JSON.stringify(storeItem, null, 4)}</pre>
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
        <MarkdownEditor
          label="Description for this quiz item"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
          text={storeItem.title ?? ""}
        />
      </InfoContainer>
      <OneLineInfoContainer>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Min words"
            variant="outlined"
            value={storeItem.minWords ?? ""}
            type="number"
            onChange={event =>
              dispatch(
                editedItemMinWords(storeItem.id, Number(event.target.value)),
              )
            }
          />
        </InlineFieldWrapper>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Max words"
            variant="outlined"
            value={storeItem.maxWords ?? ""}
            type="number"
            onChange={event =>
              dispatch(
                editedItemMaxWords(storeItem.id, Number(event.target.value)),
              )
            }
          />
        </InlineFieldWrapper>
      </OneLineInfoContainer>
    </>
  )
}

export default EssayContent

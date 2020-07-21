import React from "react"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import { useTypedSelector } from "../../../../store/store"
import styled from "styled-components"
import { Box, Button, Fade, Modal } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPen,
  faWindowClose,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import { useDispatch } from "react-redux"
import CustomModalContent from "./CustomModalContent"
import { deletedItem } from "../../../../store/editor/editorActions"

interface customFrontend {
  item: NormalizedItem
}

const EmptyBox = styled(Box)`
  width: 100% !important;
  height: 200px !important;
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`
const EditItemButton = styled(Button)``

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

const DeleteButton = styled(Button)`
  display: flex !important;
`

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const CustomFrontend = ({ item }: customFrontend) => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )
  const dispatch = useDispatch()
  return (
    <>
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
            <CustomModalContent item={storeItem} />
            <ModalButtonWrapper>
              <DeleteButton
                onClick={() => dispatch(deletedItem(storeItem.id, quizId))}
              >
                <FontAwesomeIcon icon={faTrash} size="2x" color="red" />
              </DeleteButton>
            </ModalButtonWrapper>
          </AdvancedBox>
        </Fade>
      </StyledModal>
      <EditButtonWrapper>
        <EditItemButton
          onClick={() => dispatch(setAdvancedEditing(storeItem.id, true))}
        >
          <FontAwesomeIcon icon={faPen} size="2x" />
        </EditItemButton>
      </EditButtonWrapper>
      <EmptyBox />
    </>
  )
}

export default CustomFrontend

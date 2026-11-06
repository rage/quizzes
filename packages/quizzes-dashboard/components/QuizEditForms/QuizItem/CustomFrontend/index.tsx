import React from "react"

import { useDispatch } from "react-redux"
import styled from "styled-components"

import {
  faPen,
  faWindowClose,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Button, Fade, Modal } from "@mui/material"

import { deletedItem } from "../../../../store/editor/editorActions"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import { useTypedSelector } from "../../../../store/store"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import CustomModalContent from "./CustomModalContent"

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
  background-color: #fafafa !important;
  min-width: 80% !important;
  min-height: 50% !important;
  max-width: 80% !important;
  max-height: 50% !important;
  overflow-y: scroll !important;
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
  const quizId = useTypedSelector((state) => state.editor.quizId)
  const storeItem = useTypedSelector((state) => state.editor.items[item.id])
  const variables = useTypedSelector(
    (state) => state.editor.itemVariables[item.id],
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

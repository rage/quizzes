import React from "react"
import { Box, Button } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Item } from "../../../../types/NormalizedQuiz"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { deletedItem } from "../../../../store/editor/editorActions"

const EmptyBox = styled(Box)`
  width: 100% !important;
  height: 200px !important;
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const DeleteButton = styled(Button)`
  display: flex !important;
  align-self: flex-end !important;
`

interface EditorModalProps {
  item: Item
}

export const ModalContent = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const dispatch = useDispatch()

  return (
    <>
      <EmptyBox />
      <EditButtonWrapper>
        <DeleteButton>
          <FontAwesomeIcon
            icon={faTrash}
            color="red"
            onClick={() => {
              dispatch(deletedItem(storeItem.id))
            }}
          />
        </DeleteButton>
      </EditButtonWrapper>
    </>
  )
}

export default ModalContent

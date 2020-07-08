import React from "react"
import { Box, Button } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Item } from "../../../../types/NormalizedQuiz"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { deletedItemFromItems } from "../../../../store/editor/items/itemAction"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import { deletedItemFromQuiz } from "../../../../store/editor/quiz/quizActions"

const EmptyBox = styled(Box)`
  width: 100% !important;
  height: 200px !important;
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

interface EditorModalProps {
  item: Item
}

export const ModalContent = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const quizId = useTypedSelector(state => state.editor.quizId)
  const dispatch = useDispatch()

  return (
    <>
      <EmptyBox />
      <EditButtonWrapper>
        <Button>
          <FontAwesomeIcon
            icon={faTrash}
            color="red"
            size="2x"
            onClick={() => {
              dispatch(setAdvancedEditing(storeItem.id, false))
              dispatch(deletedItemFromQuiz(quizId, storeItem.id))
              dispatch(deletedItemFromItems(storeItem.id))
            }}
          />
        </Button>
      </EditButtonWrapper>
    </>
  )
}

export default ModalContent

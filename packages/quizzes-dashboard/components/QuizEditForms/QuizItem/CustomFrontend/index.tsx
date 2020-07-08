import React from "react"
import { Item } from "../../../../types/NormalizedQuiz"
import { useTypedSelector } from "../../../../store/store"
import styled from "styled-components"
import { Box, Button, Fade, Modal } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import { useDispatch } from "react-redux"
import ModalContent from "./CustomFrontendModal"

interface customFrontend {
  item: Item
}

const EmptyBox = styled(Box)`
  width: 100% !important;
  height: 200px !important;
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
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
  padding: 1rem !important;
  float: right;
`

export const CustomFrontend = ({ item }: customFrontend) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(state => state.editor.variables[item.id])
  const dispatch = useDispatch()
  return (
    <>
      <StyledModal
        open={variables.advancedEditing}
        onClose={() => dispatch(setAdvancedEditing(storeItem.id, false))}
      >
        <Fade in={variables.advancedEditing}>
          <AdvancedBox>
            <CloseButton
              onClick={() => dispatch(setAdvancedEditing(storeItem.id, false))}
            >
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <ModalContent item={storeItem} />
          </AdvancedBox>
        </Fade>
      </StyledModal>

      <EditButtonWrapper>
        <Button>
          <FontAwesomeIcon
            icon={faPen}
            size="2x"
            onClick={() => dispatch(setAdvancedEditing(storeItem.id, true))}
          />
        </Button>
      </EditButtonWrapper>
      <EmptyBox />
    </>
  )
}

export default CustomFrontend

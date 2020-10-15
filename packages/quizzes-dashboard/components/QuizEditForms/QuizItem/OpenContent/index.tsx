import React from "react"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import { TextField, Button, Modal, Box, Fade } from "@material-ui/core"
import styled from "styled-components"
import {
  editedValidityRegex,
  editedQuizItemTitle,
  editedQuizItemBody,
} from "../../../../store/editor/items/itemAction"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWindowClose,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {
  setValidRegex,
  setRegex,
  setTestingRegex,
  setAdvancedEditing,
} from "../../../../store/editor/itemVariables/itemVariableActions"
import OpenModalContent from "./OpenModalContent"
import { deletedItem } from "../../../../store/editor/editorActions"
import RegexTesterModalContent from "./RegexTesterModalContent"

const AdvancedBox = styled(Box)`
  background-color: #fafafa !important;
  min-width: 1000px !important;
  min-height: 800px !important;
  max-width: 1000px !important;
  max-height: 800px !important;
  overflow-y: scroll !important;
`

const EditItemButton = styled(Button)``

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
`

const ItemInfo = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
`

const StyledButton = styled(Button)`
  display: flex;
  width: 20%;
  margin-left: 0.5rem !important;
`

const RegexContainer = styled.div`
  display: flex;
`

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledBox = styled(Box)`
  background-color: #fafafa;
  min-width: 300px !important;
  min-height: 300px !important;
  max-height: 300px !important;
  max-width: 300px !important;
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
interface openContentProps {
  item: NormalizedItem
}

const OpenContent = ({ item }: openContentProps) => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )
  const dispatch = useDispatch()

  const handleRegexChange = (input: string): void => {
    try {
      const newRegex = new RegExp(input)
      dispatch(editedValidityRegex(item.id, input))
      dispatch(setValidRegex(storeItem.id, true))
    } catch (err) {
      dispatch(setValidRegex(storeItem.id, false))
    }
  }

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
            <OpenModalContent item={storeItem} />
            <ModalButtonWrapper>
              <DeleteButton
                onClick={() => dispatch(deletedItem(storeItem.id, quizId))}
              >
                <FontAwesomeIcon icon={faTrash} color="red" size="2x" />
              </DeleteButton>
            </ModalButtonWrapper>
          </AdvancedBox>
        </Fade>
      </StyledModal>
      <StyledModal
        open={variables.testingRegex}
        onClose={() => dispatch(setTestingRegex(storeItem.id, false))}
      >
        <StyledBox>
          <ModalButtonWrapper>
            <CloseButton
              onClick={() => dispatch(setTestingRegex(storeItem.id, false))}
              size="small"
            >
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
          </ModalButtonWrapper>
          <RegexTesterModalContent item={item} />
        </StyledBox>
      </StyledModal>
      <ItemInfo>
        <TextField
          value={storeItem.title ?? ""}
          multiline
          fullWidth
          variant="outlined"
          label="title"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
      </ItemInfo>
      <ItemInfo>
        <TextField
          value={storeItem.body ?? ""}
          multiline
          fullWidth
          variant="outlined"
          label="Body"
          onChange={event =>
            dispatch(editedQuizItemBody(event.target.value, storeItem.id))
          }
        />
      </ItemInfo>
      <RegexContainer>
        <TextField
          error={!variables.validRegex}
          fullWidth
          label="Validity regex"
          variant="outlined"
          value={variables.regex ?? ""}
          helperText={!variables.validRegex && "Invalid regex"}
          onChange={event => {
            dispatch(setRegex(storeItem.id, event.target.value))
            handleRegexChange(event.target.value)
          }}
        />
        <StyledButton
          variant="outlined"
          onClick={() => dispatch(setTestingRegex(storeItem.id, true))}
          size="large"
        >
          Test Regex
        </StyledButton>
      </RegexContainer>
    </>
  )
}
export default OpenContent

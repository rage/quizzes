import React from "react"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import styled from "styled-components"
import { Button, TextField, Modal, Fade, Box } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { editedQuizItemTitle } from "../../../../store/editor/items/itemAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWindowClose,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import ClickableMultipleChoiceModalContent from "./ClickableMultipleChoiceModalContent"
import ClickableMultipleChoiceButton from "./ClickableMultiplChoiceButton"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import {
  createdNewOption,
  deletedItem,
} from "../../../../store/editor/editorActions"

const QuizContent = styled.div`
  padding: 1rem;
  display: inline;
`

const QuizContentLineContainer = styled.div`
  display: flex !important;
`
const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
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

const DeleteButton = styled(Button)`
  display: flex !important;
`

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const AddOptionButton = styled(Button)``

const EditItemButton = styled(Button)``

interface clickableMultiplChoiceContentProps {
  item: NormalizedItem
}

const ClickableMultipleChoiceContent = ({ item }: clickableMultiplChoiceContentProps) => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeOptions = useTypedSelector(state => state.editor.options)
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
            <ClickableMultipleChoiceModalContent item={storeItem} />
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
      <QuizContentLineContainer>
        <QuizContent>
          <TextField
            multiline
            label="Title"
            variant="outlined"
            value={storeItem.title ?? ""}
            onChange={event =>
              dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
            }
          />
        </QuizContent>
        {storeItem.options.map(option => (
          <QuizContent key={option}>
            <ClickableMultipleChoiceButton option={storeOptions[option]} />
          </QuizContent>
        ))}
        <QuizContent>
          <AddOptionButton
            title="add option"
            onClick={() => dispatch(createdNewOption(storeItem.id))}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" color="blue" />
          </AddOptionButton>
        </QuizContent>
      </QuizContentLineContainer>
    </>
  )
}

export default ClickableMultipleChoiceContent

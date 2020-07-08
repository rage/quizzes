import React, { useState } from "react"
import { Item } from "../../../../types/NormalizedQuiz"
import styled from "styled-components"
import { Button, TextField, Modal, Fade, Box } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { editedQuizItemTitle } from "../../../../store/editor/items/itemAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose, faPen, faPlus } from "@fortawesome/free-solid-svg-icons"
import AdvancedEditorModal from "./AdvancedEditorModalContent"
import MultipleChoiceButton from "./MultiplChoiceButton"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"

const QuizContent = styled.div`
  padding: 1rem;
  display: inline;
`

const QuizContentLineContainer = styled.div`
  display: flex !important;
`
const EditButtonWrapper = styled.div`
  display: flex;
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

const AddOptionButton = styled(Button)``

const EditItemButton = styled(Button)``

interface multiplChoiceContentProps {
  item: Item
}

const MultipleChoiceContent = ({ item }: multiplChoiceContentProps) => {
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
            <CloseButton
              onClick={() => dispatch(setAdvancedEditing(storeItem.id, false))}
            >
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <AdvancedEditorModal item={storeItem} />
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
            <MultipleChoiceButton option={storeOptions[option]} />
          </QuizContent>
        ))}
        <QuizContent>
          <AddOptionButton title="add option">
            <FontAwesomeIcon icon={faPlus} size="2x" color="blue" />
          </AddOptionButton>
        </QuizContent>
      </QuizContentLineContainer>
    </>
  )
}

export default MultipleChoiceContent

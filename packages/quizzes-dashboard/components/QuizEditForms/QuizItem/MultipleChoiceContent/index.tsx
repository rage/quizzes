import React from "react"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import styled from "styled-components"
import {
  Button,
  Modal,
  Fade,
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
} from "@material-ui/core"
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
import MultipleChoiceModalContent from "./MultipleChoiceModalContent"
import MultipleChoiceButton from "./MultiplChoiceButton"
import { setAdvancedEditing } from "../../../../store/editor/itemVariables/itemVariableActions"
import {
  createdNewOption,
  deletedItem,
} from "../../../../store/editor/editorActions"
import MarkdownEditor from "../../../MarkdownEditor"

const QuizContent = styled.div`
  padding: 1rem;
  display: flex;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

const QuizContentLineContainer = styled.div`
  display: flex !important;
  justify-content: space-around;
  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`
const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
`

const StyledModal = styled(Modal)`
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  max-width: 100% !important;
  max-height: 100% !important;
`

const AdvancedBox = styled(Box)`
  background-color: #fafafa !important;
  max-width: 60% !important;
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

const Spacer = styled.div`
  margin: 5% 0;
`

interface multipleChoiceContentProps {
  item: NormalizedItem
}

const MultipleChoiceContent = ({ item }: multipleChoiceContentProps) => {
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
        <Button
          onClick={() => dispatch(setAdvancedEditing(storeItem.id, true))}
          title="edit item"
        >
          <FontAwesomeIcon icon={faPen} size="2x"></FontAwesomeIcon>
        </Button>
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
            <MultipleChoiceModalContent item={storeItem} />
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
      <MarkdownEditor
        label="title"
        onChange={event =>
          dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
        }
        text={storeItem.title ?? ""}
      />
      <QuizContentLineContainer>
        {storeItem.options.map(option => (
          <QuizContent key={option}>
            <MultipleChoiceButton option={storeOptions[option]} />
          </QuizContent>
        ))}
        <QuizContent>
          <Button
            title="add option"
            onClick={() => dispatch(createdNewOption(storeItem.id))}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" color="blue" />
          </Button>
        </QuizContent>
      </QuizContentLineContainer>
      <Spacer />
      <FormControl component="fieldset">
        <FormLabel component="legend">Options Layout</FormLabel>
        <RadioGroup
          aria-label="direction"
          name="direction"
          value="row"
          // onChange={handleChange}
        >
          <FormHelperText>
            Choose the direction in which the quiz item options will be layed
            out on the embedded widget.
          </FormHelperText>
          <FormControlLabel value="row" control={<Radio />} label="Row" />
          <FormControlLabel value="column" control={<Radio />} label="Column" />
        </RadioGroup>
      </FormControl>
    </>
  )
}

export default MultipleChoiceContent

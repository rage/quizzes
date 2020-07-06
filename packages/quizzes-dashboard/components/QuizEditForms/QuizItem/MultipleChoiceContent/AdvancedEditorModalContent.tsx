import React from "react"
import {
  Fade,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import {
  editedQuizItemTitle,
  toggledSharedOptionFeedbackMessage,
  toggledMultiOptions,
  editedSharedOptionsFeedbackMessage,
} from "../../../../store/editor/items/itemAction"
import { useTypedSelector } from "../../../../store/store"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Item } from "../../../../types/NormalizedQuiz"
import MultipleChoiceButton from "./MultiplChoiceButton"

const QuizContent = styled.div`
  padding: 1rem;
  display: inline;
`

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
`

interface EditorModalProps {
  item: Item
}

export const AdvancedEditorModal = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const storeOptions = useTypedSelector(state => state.editor.options)
  const dispatch = useDispatch()
  return (
    <>
      <ModalContent>
        <Typography variant="h4">Advanced editing</Typography>
      </ModalContent>
      <ModalContent>
        <FormGroup row>
          <FormControlLabel
            label="Shared feedback message"
            labelPlacement="start"
            control={
              <Checkbox
                color="primary"
                checked={storeItem.usesSharedOptionFeedbackMessage}
                onChange={event =>
                  dispatch(
                    toggledSharedOptionFeedbackMessage(
                      storeItem.id,
                      event.target.checked,
                    ),
                  )
                }
              />
            }
          />
          <FormControlLabel
            label="Multi"
            labelPlacement="start"
            control={
              <Checkbox
                color="primary"
                checked={storeItem.multi}
                onChange={event =>
                  dispatch(
                    toggledMultiOptions(storeItem.id, event.target.checked),
                  )
                }
              />
            }
          />
        </FormGroup>
      </ModalContent>
      <ModalContent>
        <TextField
          label="Title"
          value={storeItem.title}
          fullWidth
          multiline
          variant="outlined"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
      </ModalContent>
      <ModalContent>
        {storeItem.options.map(option => (
          <QuizContent key={option}>
            <MultipleChoiceButton option={storeOptions[option]} />
          </QuizContent>
        ))}
      </ModalContent>
      <ModalContent>
        <Fade in={storeItem.usesSharedOptionFeedbackMessage}>
          <TextField
            label="Shared option feedback message"
            variant="outlined"
            fullWidth
            value={storeItem.sharedOptionFeedbackMessage}
            onChange={event =>
              dispatch(
                editedSharedOptionsFeedbackMessage(
                  storeItem.id,
                  event.target.value,
                ),
              )
            }
          />
        </Fade>
      </ModalContent>
    </>
  )
}

export default AdvancedEditorModal

import React from "react"
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core"
import {
  editedQuizItemTitle,
  toggledSharedOptionFeedbackMessage,
  toggledMultiOptions,
  editedSharedOptionsFeedbackMessage,
  editedItemSuccessMessage,
  editedItemFailureMessage,
} from "../../../../store/editor/items/itemAction"
import { useTypedSelector } from "../../../../store/store"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import MultipleChoiceButton from "./ClickableMultiplChoiceButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { createdNewOption } from "../../../../store/editor/editorActions"
import MarkdownEditor from "../../../MarkdownEditor"

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
`
const ModalContentTitleWrapper = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
`

const ModalContentOptionWrapper = styled.div`
  padding: 1rem;
  display: flex !important;
  justify-content: space-evenly !important;
`

const AddOptionButton = styled(Button)``

interface EditorModalProps {
  item: NormalizedItem
}

export const MultipleChoiceModalContent = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const storeOptions = useTypedSelector(state => state.editor.options)
  const dispatch = useDispatch()
  return (
    <>
      <ModalContentTitleWrapper>
        <Typography variant="h4">Advanced editing</Typography>
      </ModalContentTitleWrapper>
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
        <MarkdownEditor
          label="Title"
          text={storeItem.title ?? ""}
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
      </ModalContent>
      <ModalContent>
        <AddOptionButton
          title="add option"
          onClick={() => dispatch(createdNewOption(storeItem.id))}
        >
          <FontAwesomeIcon icon={faPlus} size="2x" color="blue" />
        </AddOptionButton>
      </ModalContent>
      <ModalContentOptionWrapper>
        {storeItem.options.map(option => (
          <ModalContent key={option}>
            <MultipleChoiceButton option={storeOptions[option]} />
          </ModalContent>
        ))}
      </ModalContentOptionWrapper>
      {storeItem.usesSharedOptionFeedbackMessage ? (
        <ModalContent>
          <MarkdownEditor
            label="Shared option feedback message"
            text={storeItem.sharedOptionFeedbackMessage ?? ""}
            onChange={event =>
              dispatch(
                editedSharedOptionsFeedbackMessage(
                  storeItem.id,
                  event.target.value,
                ),
              )
            }
          />
        </ModalContent>
      ) : (
        <>
          <ModalContent>
            <MarkdownEditor
              label="Success message"
              text={storeItem.successMessage ?? ""}
              onChange={event =>
                dispatch(
                  editedItemSuccessMessage(storeItem.id, event.target.value),
                )
              }
            />
          </ModalContent>
          <ModalContent>
            <MarkdownEditor
              label="Failure message"
              text={storeItem.failureMessage ?? ""}
              onChange={event =>
                dispatch(
                  editedItemFailureMessage(storeItem.id, event.target.value),
                )
              }
            />
          </ModalContent>
        </>
      )}
    </>
  )
}

export default MultipleChoiceModalContent

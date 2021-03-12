import React from "react"
import {
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
} from "@material-ui/core"
import {
  editedQuizItemTitle,
  toggledSharedOptionFeedbackMessage,
  toggledMultiOptions,
  editedSharedOptionsFeedbackMessage,
  editedItemSuccessMessage,
  editedItemFailureMessage,
  toggledAllAnswersCorrect,
} from "../../../../store/editor/items/itemAction"
import { useTypedSelector } from "../../../../store/store"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import MultipleChoiceButton from "./MultiplChoiceButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { createdNewOption } from "../../../../store/editor/editorActions"
import MarkdownEditor from "../../../MarkdownEditor"

const ModalContent = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`
const ModalContentTitleWrapper = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
  @media only screen and (max-width: 600px) {
    width: auto !important;
  }
`

const ModalContentOptionWrapper = styled.div`
  padding: 0.5rem;
  display: flex !important;
  justify-content: space-evenly !important;
  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;
    width: auto;
  }
`

const AllAnswersCorrectField = styled.div`
  display: flex;
  width: 100%;
`

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
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
          text={storeItem.title}
        />
      </ModalContent>
      <ModalContent>
        <AllAnswersCorrectField>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={storeItem.allAnswersCorrect}
                  onChange={() =>
                    dispatch(toggledAllAnswersCorrect(storeItem.id))
                  }
                />
              }
              label="All answer correct"
            />
          </FormGroup>
        </AllAnswersCorrectField>
      </ModalContent>
      <ModalContent>
        <Button
          title="add option"
          onClick={() => dispatch(createdNewOption(storeItem.id))}
        >
          <FontAwesomeIcon icon={faPlus} size="2x" color="blue" />
        </Button>
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
            onChange={event =>
              dispatch(
                editedSharedOptionsFeedbackMessage(
                  storeItem.id,
                  event.target.value,
                ),
              )
            }
            text={storeItem.sharedOptionFeedbackMessage ?? ""}
          />
        </ModalContent>
      ) : (
        <>
          <ModalContent>
            <MarkdownEditor
              label="Success message"
              onChange={event =>
                dispatch(
                  editedItemSuccessMessage(storeItem.id, event.target.value),
                )
              }
              text={storeItem.successMessage ?? ""}
            />
          </ModalContent>
          <ModalContent>
            <MarkdownEditor
              label="Failure message"
              onChange={event =>
                dispatch(
                  editedItemFailureMessage(storeItem.id, event.target.value),
                )
              }
              text={storeItem.failureMessage ?? ""}
            />
          </ModalContent>
        </>
      )}
    </>
  )
}

export default MultipleChoiceModalContent

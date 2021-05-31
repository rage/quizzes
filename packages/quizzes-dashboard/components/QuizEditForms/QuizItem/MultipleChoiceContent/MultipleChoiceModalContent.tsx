import React from "react"
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
  useFormControl,
  Select,
  MenuItem,
  TextField,
  Fade,
  Grow,
  Collapse,
  Slide,
} from "@material-ui/core"
import {
  editedQuizItemTitle,
  toggledSharedOptionFeedbackMessage,
  toggledMultiOptions,
  editedSharedOptionsFeedbackMessage,
  editedItemSuccessMessage,
  editedItemFailureMessage,
  toggledAllAnswersCorrect,
  editedItemDirection,
  editedQuizItemFeedbackDisplayPolicy,
  editedMultipleSelectedOptionsGradingOptions,
  editedMultipleSelectedOptionsGradingPolicyN,
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
import { ModalWrapper } from "../../../Shared/Modal"

const ModalContent = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
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

const Spacer = styled.div`
  margin: 5% 0;
`

interface EditorModalProps {
  item: NormalizedItem
}

export const MultipleChoiceModalContent = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const storeOptions = useTypedSelector(state => state.editor.options)
  const dispatch = useDispatch()

  return (
    <ModalWrapper>
      <ModalContentTitleWrapper>
        <Typography variant="h4">Advanced editing</Typography>
      </ModalContentTitleWrapper>
      <ModalContent>
        <Select
          fullWidth
          label="Feedback display policy"
          variant="outlined"
          value={storeItem.feedbackDisplayPolicy}
          onChange={event =>
            dispatch(
              editedQuizItemFeedbackDisplayPolicy(
                storeItem.id,
                event.target.value,
              ),
            )
          }
        >
          <MenuItem value="DisplayFeedbackOnQuizItem">On quiz item</MenuItem>
          <MenuItem value="DisplayFeedbackOnAllOptions">
            On each quiz item answer option
          </MenuItem>
        </Select>
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
              label="All answers correct (no matter what one answers it is correct)"
              labelPlacement="start"
            />
            <Grow in={!storeItem.allAnswersCorrect}>
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
            </Grow>
          </FormGroup>
        </AllAnswersCorrectField>
      </ModalContent>
      <Collapse in={!storeItem.allAnswersCorrect && storeItem.multi}>
        <ModalContent>
          <Select
            variant="outlined"
            value={storeItem.multipleSelectedOptionsGradingOptions}
            onChange={e =>
              dispatch(
                editedMultipleSelectedOptionsGradingOptions(
                  storeItem.id,
                  e.target.value as string,
                ),
              )
            }
          >
            <MenuItem value="NeedToSelectAllCorrectOptions">
              Need to select all correct options
            </MenuItem>
            <MenuItem value="NeedToSelectNCorrectOptions">
              Need to select n -correct options
            </MenuItem>
          </Select>
          <Grow
            in={
              storeItem.multipleSelectedOptionsGradingOptions ===
              "NeedToSelectNCorrectOptions"
            }
          >
            <TextField
              helperText="Amount of correct options to select"
              variant="outlined"
              type="number"
              value={storeItem.multipleSelectedOptionsGradingPolicyN}
              onChange={e =>
                dispatch(
                  editedMultipleSelectedOptionsGradingPolicyN(
                    storeItem.id,
                    (e.target.value as unknown) as number,
                  ),
                )
              }
            ></TextField>
          </Grow>
        </ModalContent>
      </Collapse>
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
      <Spacer />
      <FormControl component="fieldset">
        <FormLabel component="legend">Layout of options</FormLabel>
        <RadioGroup
          aria-label="direction"
          name="direction"
          value={storeItem.direction}
          onChange={e =>
            dispatch(editedItemDirection(storeItem.id, e.target.value))
          }
        >
          <FormHelperText>
            Choose the direction in which the quiz item options will be layed
            out in the embedded widget.
          </FormHelperText>
          <FormControlLabel value="row" control={<Radio />} label="Row" />
          <FormControlLabel value="column" control={<Radio />} label="Column" />
        </RadioGroup>
      </FormControl>
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
        </FormGroup>
      </ModalContent>
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
    </ModalWrapper>
  )
}

export default MultipleChoiceModalContent

import React from "react"
import styled from "styled-components"
import {
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@material-ui/core"
import {
  editedOptionTitle,
  editedOptionSuccessMessage,
  editedOptionFailureMessage,
  editedOptionCorrectness,
} from "../../../../store/editor/options/optionActions"
import { useDispatch } from "react-redux"
import { NormalizedOption } from "../../../../types/NormalizedQuiz"
import { useTypedSelector } from "../../../../store/store"
import MarkdownEditor from "../../../MarkdownEditor"

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
`

interface OptionEditorProps {
  option: NormalizedOption
}

export const OptionModalContent = ({ option }: OptionEditorProps) => {
  const storeOption = useTypedSelector(state => state.editor.options[option.id])
  const dispatch = useDispatch()
  return (
    <>
      <ModalContent>
        <Typography>Editing Option</Typography>
      </ModalContent>
      <ModalContent>
        <FormControl>
          <FormControlLabel
            label="Correct"
            labelPlacement="start"
            control={
              <Checkbox
                color="primary"
                checked={storeOption.correct}
                onChange={event =>
                  dispatch(
                    editedOptionCorrectness(
                      storeOption.id,
                      event.target.checked,
                    ),
                  )
                }
              />
            }
          />
        </FormControl>
      </ModalContent>
      <ModalContent>
        <MarkdownEditor
          label="Option title"
          text={storeOption.title ?? ""}
          onChange={event =>
            dispatch(editedOptionTitle(event.target.value, storeOption.id))
          }
        />
      </ModalContent>
      <ModalContent>
        <MarkdownEditor
          label={storeOption.correct ? "Success message" : "Failure message"}
          text={
            storeOption.correct
              ? storeOption.successMessage ?? ""
              : storeOption.failureMessage ?? ""
          }
          onChange={
            storeOption.correct
              ? event =>
                  dispatch(
                    editedOptionSuccessMessage(
                      storeOption.id,
                      event.target.value,
                    ),
                  )
              : event =>
                  dispatch(
                    editedOptionFailureMessage(
                      storeOption.id,
                      event.target.value,
                    ),
                  )
          }
        />
      </ModalContent>
    </>
  )
}

export default OptionModalContent

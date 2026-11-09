import React from "react"

import { useDispatch } from "react-redux"
import styled from "styled-components"

import {
  TextField,
  Typography,
  FormGroup,
  Radio,
  FormControlLabel,
} from "@mui/material"

import { editedQuizItemTitle } from "../../../../store/editor/items/itemAction"
import { useTypedSelector } from "../../../../store/store"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import { useScaleRange } from "./useScaleRange"

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
`

const LabelFieldContainer = styled(TextField)`
  margin-right: 0.5rem !important;
`

const ValueFieldContainer = styled(TextField)`
  margin-left: 0.5rem !important;
`

const PreviewModalContainer = styled.div`
  padding: 1rem !important;
  justify-content: center !important;
  display: flex !important;
`

const StyledFormLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  margin-right: 0px !important;
`

const PreviewLabelContainer = styled.div`
  padding: 1rem;
  display: flex !important;
  align-items: center !important;
`

const ModalContentTitleWrapper = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
`

interface ScaleItemEditorModalProps {
  item: NormalizedItem
}
export const ScaleModalContent = ({ item }: ScaleItemEditorModalProps) => {
  const dispatch = useDispatch()
  const storeItem = useTypedSelector((state) => state.editor.items[item.id])
  const variables = useTypedSelector(
    (state) => state.editor.itemVariables[item.id],
  )

  const { onMinChange, onMaxChange } = useScaleRange(item.id)

  return (
    <>
      <ModalContentTitleWrapper>
        <Typography variant="h4">Advanced editing</Typography>
      </ModalContentTitleWrapper>
      <ModalContent>
        <TextField
          label="Title"
          value={storeItem.title}
          fullWidth
          multiline
          variant="outlined"
          onChange={(event) =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
      </ModalContent>
      <ModalContent>
        <ValueFieldContainer
          error={!variables.validMin}
          helperText={!variables.validMin ? "invalid min value" : ""}
          type="number"
          label="Min value"
          value={variables.scaleMin ?? ""}
          fullWidth
          variant="outlined"
          onChange={(event) => onMinChange(Number(event.target.value))}
        />
      </ModalContent>
      <ModalContent>
        <ValueFieldContainer
          error={!variables.validMax}
          helperText={!variables.validMax ? "invalid max value" : ""}
          type="number"
          label="Max value"
          value={variables.scaleMax ?? ""}
          fullWidth
          variant="outlined"
          onChange={(event) => onMaxChange(Number(event.target.value))}
        />
      </ModalContent>
      <PreviewModalContainer>
        <FormGroup row>
          {variables.array.map((item) => {
            return (
              <div key={item}>
                <StyledFormLabel
                  disabled
                  control={<Radio />}
                  label={item}
                  labelPlacement="top"
                />
              </div>
            )
          })}
        </FormGroup>
      </PreviewModalContainer>
    </>
  )
}

export default ScaleModalContent

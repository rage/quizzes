import React from "react"
import { Item } from "../../../../types/NormalizedQuiz"
import styled from "styled-components"
import { useTypedSelector } from "../../../../store/store"
import {
  TextField,
  Typography,
  FormGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core"
import {
  editedQuizItemTitle,
  editedScaleMinLabel,
  editedScaleMaxLabel,
  editedScaleMaxValue,
  editedScaleMinValue,
} from "../../../../store/editor/items/itemAction"
import { useDispatch } from "react-redux"
import {
  setScaleMin,
  setScaleMax,
} from "../../../../store/editor/itemVariables/itemVariableActions"

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
  item: Item
}
export const ScaleModalContent = ({ item }: ScaleItemEditorModalProps) => {
  const dispatch = useDispatch()
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )

  const handleMinValueChange = (value: number) => {
    if (value >= 0 && value < variables.scaleMax) {
      dispatch(setScaleMin(storeItem.id, value, true))
      dispatch(editedScaleMinValue(storeItem.id, value))
    } else {
      dispatch(setScaleMin(storeItem.id, value, false))
    }
  }

  const handleMaxValueChange = (value: number) => {
    if (value >= 0 && value > variables.scaleMin && value < 11) {
      dispatch(setScaleMax(storeItem.id, value, true))
      dispatch(editedScaleMaxValue(storeItem.id, value))
    } else {
      dispatch(setScaleMax(storeItem.id, value, false))
    }
  }

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
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
      </ModalContent>
      <ModalContent>
        <LabelFieldContainer
          label="Min value label"
          value={storeItem.minLabel}
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedScaleMinLabel(storeItem.id, event.target.value))
          }
        />
        <ValueFieldContainer
          error={!variables.validMin}
          helperText={!variables.validMin ? "invalid min value" : ""}
          type="number"
          label="Min value"
          value={variables.scaleMin}
          fullWidth
          variant="outlined"
          onChange={event => handleMinValueChange(Number(event.target.value))}
        />
      </ModalContent>
      <ModalContent>
        <LabelFieldContainer
          label="Max value label"
          value={storeItem.maxLabel}
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedScaleMaxLabel(storeItem.id, event.target.value))
          }
        />
        <ValueFieldContainer
          error={!variables.validMax}
          helperText={!variables.validMax ? "invalid max value" : ""}
          type="number"
          label="Max value"
          value={variables.scaleMax}
          fullWidth
          variant="outlined"
          onChange={event => handleMaxValueChange(Number(event.target.value))}
        />
      </ModalContent>
      <PreviewModalContainer>
        <PreviewLabelContainer>
          <Typography variant="button">{storeItem.minLabel}</Typography>
        </PreviewLabelContainer>
        <FormGroup row>
          {variables.array.map(item => {
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
        <PreviewLabelContainer>
          <Typography variant="button">{storeItem.maxLabel}</Typography>
        </PreviewLabelContainer>
      </PreviewModalContainer>
    </>
  )
}

export default ScaleModalContent

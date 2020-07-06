import React, { useState, useEffect } from "react"
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

interface ScaleItemEditorModalProps {
  item: Item
}
export const ScaleItemEditorModal = ({ item }: ScaleItemEditorModalProps) => {
  const dispatch = useDispatch()
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const [min, setMin] = useState(storeItem.minValue ?? 0)
  const [max, setMax] = useState(storeItem.maxValue ?? 0)
  const [validMin, setValidMin] = useState(
    (storeItem.minValue ?? 0) < (storeItem.maxValue ?? 0),
  )
  const [validMax, setValidMax] = useState(
    (storeItem.maxValue ?? 0) > (storeItem.minValue ?? 0),
  )
  const [array, setArray] = useState([0])
  useEffect(() => createArray(), [min, max])

  const handleMinValueChange = (value: number) => {
    if (value >= 0 && value < max) {
      setValidMin(true)
      setMin(value)
      dispatch(editedScaleMinValue(storeItem.id, value))
    } else {
      setMin(value)
      setValidMin(false)
    }
  }

  const handleMaxValueChange = (value: number) => {
    if (value >= 0 && value > min && value < 11) {
      setValidMax(true)
      setMax(value)
      dispatch(editedScaleMaxValue(storeItem.id, value))
    } else {
      setMax(value)
      setValidMax(false)
    }
  }

  const createArray = () => {
    if (validMin && validMax) {
      const newArray: number[] = []
      for (var i = 0; i < max - min + 1; i++) {
        newArray[i] = min + i
      }
      setArray(newArray)
    }
  }
  return (
    <>
      <ModalContent>
        <Typography variant="h4">Advanced editing</Typography>
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
          error={!validMin}
          helperText={!validMin ? "invalid min value" : ""}
          type="number"
          label="Min value"
          value={min}
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
          error={!validMax}
          helperText={!validMax ? "invalid max value" : ""}
          type="number"
          label="Max value"
          value={max}
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
          {array.map(item => {
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

export default ScaleItemEditorModal

import React, { useState, useEffect } from "react"
import { Item } from "../../../../types/NormalizedQuiz"
import {
  editedQuizItemTitle,
  editedScaleMinValue,
  editedScaleMaxValue,
} from "../../../../store/editor/items/itemAction"
import {
  TextField,
  FormGroup,
  Radio,
  FormControlLabel,
  Button,
  Fade,
  Modal,
  Box,
} from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import ScaleItemEditorModal from "./ScaleItemEditorModal"

const ScaleContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
`

const TitleField = styled(TextField)`
  width: 50% !important;
  display: flex;
`

const PreviewContainer = styled.div`
  width: 50% !important;
  justify-content: center !important;
  display: flex !important;
`

const MinMaxContainer = styled.div`
  width: 50% !important;
  display: flex;
`

const MinField = styled(TextField)`
  margin-right: 1rem !important;
  display: flex;
`

const MaxField = styled(TextField)`
  margin-left: 0.5rem !important;
  display: flex;
`

const StyledFormLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  margin-right: 0px !important;
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end !important;
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

const EditItemButton = styled(Button)``

interface scaleContentProps {
  item: Item
}
const ScaleContent = ({ item }: scaleContentProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const dispatch = useDispatch()
  const [min, setMin] = useState(storeItem.minValue ?? 0)
  const [max, setMax] = useState(storeItem.maxValue ?? 0)
  const [validMin, setValidMin] = useState(
    (storeItem.minValue ?? 0) < (storeItem.maxValue ?? 0),
  )
  const [validMax, setValidMax] = useState(
    (storeItem.maxValue ?? 0) > (storeItem.minValue ?? 0),
  )
  const [array, setArray] = useState([0])
  const [advancedEditing, setAdvancedEditing] = useState(false)
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
      <EditButtonWrapper>
        <EditItemButton
          onClick={() => setAdvancedEditing(true)}
          title="edit item"
        >
          <FontAwesomeIcon icon={faPen} size="2x"></FontAwesomeIcon>
        </EditItemButton>
      </EditButtonWrapper>
      <StyledModal
        open={advancedEditing}
        onClose={() => setAdvancedEditing(false)}
      >
        <Fade in={advancedEditing}>
          <AdvancedBox>
            <CloseButton onClick={() => setAdvancedEditing(false)}>
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <ScaleItemEditorModal item={storeItem} />
          </AdvancedBox>
        </Fade>
      </StyledModal>
      <ScaleContainer>
        <TitleField
          fullWidth
          multiline
          label="Title"
          variant="outlined"
          value={storeItem.title}
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
        <PreviewContainer>
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
        </PreviewContainer>
      </ScaleContainer>
      <MinMaxContainer>
        <MinField
          error={!validMin}
          helperText={!validMin ? "invalid min value" : ""}
          label="min"
          value={min}
          variant="outlined"
          type="number"
          onChange={event => handleMinValueChange(Number(event.target.value))}
        />
        <MaxField
          error={!validMax}
          helperText={!validMax ? "invalid max value" : ""}
          label="max"
          value={max}
          variant="outlined"
          type="number"
          onChange={event => handleMaxValueChange(Number(event.target.value))}
        />
      </MinMaxContainer>
    </>
  )
}

export default ScaleContent

import React from "react"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
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
import {
  faPen,
  faWindowClose,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import ScaleModalContent from "./ScaleModalContent"
import {
  setScaleMin,
  setScaleMax,
  setAdvancedEditing,
} from "../../../../store/editor/itemVariables/itemVariableActions"
import { deletedItem } from "../../../../store/editor/editorActions"
import MarkdownEditor from "../../../MarkdownEditor"

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
  background-color: #fafafa !important;
  min-width: 1000px !important;
  min-height: 800px !important;
  max-width: 1000px !important;
  max-height: 800px !important;
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

const EditItemButton = styled(Button)``

interface scaleContentProps {
  item: NormalizedItem
}
const ScaleContent = ({ item }: scaleContentProps) => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const variables = useTypedSelector(
    state => state.editor.itemVariables[item.id],
  )
  const dispatch = useDispatch()

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
      <EditButtonWrapper>
        <EditItemButton
          onClick={() => dispatch(setAdvancedEditing(storeItem.id, true))}
          title="edit item"
        >
          <FontAwesomeIcon icon={faPen} size="2x"></FontAwesomeIcon>
        </EditItemButton>
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
            <ScaleModalContent item={storeItem} />
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
      <ScaleContainer>
        <MarkdownEditor
          label="Title"
          text={storeItem.title ?? ""}
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        />
        <PreviewContainer>
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
        </PreviewContainer>
      </ScaleContainer>
      <MinMaxContainer>
        <MinField
          error={!variables.validMin}
          helperText={!variables.validMin ? "invalid min value" : ""}
          label="min"
          value={variables.scaleMin}
          variant="outlined"
          type="number"
          onChange={event => handleMinValueChange(Number(event.target.value))}
        />
        <MaxField
          error={!variables.validMax}
          helperText={!variables.validMax ? "invalid max value" : ""}
          label="max"
          value={variables.scaleMax}
          variant="outlined"
          type="number"
          onChange={event => handleMaxValueChange(Number(event.target.value))}
        />
      </MinMaxContainer>
    </>
  )
}

export default ScaleContent

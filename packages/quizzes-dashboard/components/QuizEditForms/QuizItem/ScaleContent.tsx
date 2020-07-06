import React from "react"
import { Item } from "../../../types/NormalizedQuiz"
import {
  editedScaleMinMaxValue,
  editedScaleMinMaxLabel,
  editedQuizItemTitle,
} from "../../../store/editor/items/itemAction"
import { Typography, TextField } from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"

const ScaleContainer = styled.div`
  padding-top: 1rem;
  display: flex;
`
const TextFieldContainer = styled(TextField)`
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
`
const ItemInfo = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
`
interface contentBoxProps {
  item: Item
}
const ScaleContent = ({ item }: contentBoxProps) => {
  const dispatch = useDispatch()
  return (
    <>
      <ItemInfo>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, item.id))
          }
        >
          {item.title}
        </TextField>
      </ItemInfo>
      <ScaleContainer>
        <TextFieldContainer
          fullWidth
          label="Scale min value"
          defaultValue={item.minValue}
          variant="outlined"
          type="number"
          onChange={event =>
            dispatch(
              editedScaleMinMaxValue(
                item.id,
                parseInt(event.target.value),
                false,
              ),
            )
          }
        />
        <TextFieldContainer
          fullWidth
          label="Scale max value"
          defaultValue={item.maxValue}
          variant="outlined"
          type="number"
          onChange={event =>
            dispatch(
              editedScaleMinMaxValue(
                item.id,
                parseInt(event.target.value),
                true,
              ),
            )
          }
        />
      </ScaleContainer>
      <ScaleContainer>
        <TextFieldContainer
          fullWidth
          label="Label for min value"
          defaultValue={item.minWords}
          variant="outlined"
          onChange={event =>
            dispatch(editedScaleMinMaxLabel(item.id, event.target.value, false))
          }
        />
        <TextFieldContainer
          fullWidth
          label="Label for max value"
          defaultValue={item.maxWords}
          variant="outlined"
          onChange={event =>
            dispatch(editedScaleMinMaxLabel(item.id, event.target.value, true))
          }
        />
      </ScaleContainer>
    </>
  )
}

export default ScaleContent

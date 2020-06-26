import React from "react"
import { Item } from "../../types/NormalizedQuiz"
import {
  editedScaleMinMaxValue,
  editedScaleMinMaxLabel,
} from "../../store/editor/items/itemAction"
import { Typography, TextField } from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"

const ScaleContainer = styled.div`
  padding: 1rem;
  display: flex;
`

const ComponentContainer = styled.div`
  padding: 1rem;
  display: flex;
`
interface contentBoxProps {
  item: Item
}
const ScaleContent = ({ item }: contentBoxProps) => {
  const dispatch = useDispatch()
  return (
    <>
      <ScaleContainer>
        <ComponentContainer>
          <Typography variant="subtitle1">Max value: </Typography>
        </ComponentContainer>
        <ComponentContainer>
          <TextField
            defaultValue={item.maxValue}
            variant="standard"
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
          ></TextField>
        </ComponentContainer>
      </ScaleContainer>
      <ScaleContainer>
        <ComponentContainer>
          <Typography variant="subtitle1">Min value: </Typography>
        </ComponentContainer>
        <ComponentContainer>
          <TextField
            defaultValue={item.minValue}
            variant="standard"
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
          ></TextField>
        </ComponentContainer>
      </ScaleContainer>
      <ScaleContainer>
        <ComponentContainer>
          <Typography variant="subtitle1">Label for max value: </Typography>
        </ComponentContainer>
        <ComponentContainer>
          <TextField
            defaultValue={item.maxWords}
            variant="standard"
            onChange={event =>
              dispatch(
                editedScaleMinMaxLabel(item.id, event.target.value, true),
              )
            }
          ></TextField>
        </ComponentContainer>
      </ScaleContainer>
      <ScaleContainer>
        <ComponentContainer>
          <Typography variant="subtitle1">Lable for min value: </Typography>
        </ComponentContainer>
        <ComponentContainer>
          <TextField
            defaultValue={item.minWords}
            variant="standard"
            onChange={event =>
              dispatch(
                editedScaleMinMaxLabel(item.id, event.target.value, false),
              )
            }
          ></TextField>
        </ComponentContainer>
      </ScaleContainer>
    </>
  )
}

export default ScaleContent

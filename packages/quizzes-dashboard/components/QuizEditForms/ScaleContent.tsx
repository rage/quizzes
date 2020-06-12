import React from "react"
import { Item } from "../../types/EditQuiz"
import {
  editedScaleMinMaxValue,
  editedScaleMinMaxLabel,
} from "../../store/edit/actions"
import { Typography, TextField } from "@material-ui/core"
import styled from "styled-components"
import { connect } from "react-redux"

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
  editedScaleMinMaxValue: (
    itemId: string,
    newValue: number,
    max: boolean,
  ) => any
  editedScaleMinMaxLabel: (
    itemId: string,
    newLabel: string,
    max: boolean,
  ) => any
}
const ScaleContent = ({
  item,
  editedScaleMinMaxValue,
  editedScaleMinMaxLabel,
}: contentBoxProps) => {
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
            onChange={(event) =>
              editedScaleMinMaxValue(
                item.id,
                parseInt(event.target.value),
                true,
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
            onChange={(event) =>
              editedScaleMinMaxValue(
                item.id,
                parseInt(event.target.value),
                false,
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
            defaultValue={item.texts[0].maxLabel}
            variant="standard"
            onChange={(event) =>
              editedScaleMinMaxLabel(item.id, event.target.value, true)
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
            defaultValue={item.texts[0].minLabel}
            variant="standard"
            onChange={(event) =>
              editedScaleMinMaxLabel(item.id, event.target.value, false)
            }
          ></TextField>
        </ComponentContainer>
      </ScaleContainer>
    </>
  )
}

const mapDispatchToProps = { editedScaleMinMaxValue, editedScaleMinMaxLabel }

export default connect(null, mapDispatchToProps)(ScaleContent)

import React from "react"
import styled from "styled-components"
import { TextField } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { Item } from "../../../../types/NormalizedQuiz"
import {
  editedItemMaxWords,
  editedItemMinWords,
} from "../../../../store/editor/items/itemAction"

const InfoContainer = styled.div`
  padding: 1rem 0;
`

const OneLineInfoContainer = styled.div`
  padding: 1rem 0;
  display: flex;
`

const InlineFieldWrapper = styled.div`
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
  width: 100%;
`

interface essayContentProps {
  item: Item
}

const EssayContent = ({ item }: essayContentProps) => {
  const dispatch = useDispatch()
  return (
    <>
      <InfoContainer>
        <TextField
          fullWidth
          variant="outlined"
          label="Description for this quiz item"
          multiline
          rows={1}
          helperText="Use this if you cannot put the description in the 'Description for the whole quiz'-field. You may want to use this if have another quiz item before this one."
          defaultValue={item.body}
        />
      </InfoContainer>
      <OneLineInfoContainer>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Max words"
            variant="outlined"
            defaultValue={item.maxWords}
            type="number"
            onChange={event =>
              dispatch(editedItemMaxWords(item.id, Number(event.target.value)))
            }
          />
        </InlineFieldWrapper>
        <InlineFieldWrapper>
          <TextField
            fullWidth
            label="Min words"
            variant="outlined"
            defaultValue={item.minValue}
            type="number"
            onChange={event =>
              dispatch(editedItemMinWords(item.id, Number(event.target.value)))
            }
          />
        </InlineFieldWrapper>
      </OneLineInfoContainer>
    </>
  )
}

export default EssayContent

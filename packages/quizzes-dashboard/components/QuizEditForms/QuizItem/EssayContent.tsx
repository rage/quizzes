import React from "react"
import styled from "styled-components"
import { Typography, Card, TextField } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { Item } from "../../../types/NormalizedQuiz"
import {
  editedItemMaxWords,
  editedItemMinWords,
} from "../../../store/editor/items/itemAction"

const QuizCard = styled(Card)`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 40px -12px !important;
  border-radius: 1rem !important;
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 800px;
`

const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin: 0 1.5rem 0 0.5rem;
  @media (max-width: 550px) {
    text-align: center;
  }
`

const QuizHeader = styled.div`
  background-color: rgb(33, 48, 148);
  color: white;
  padding: 1rem;
  display: flex;
`

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const TitleContainer = styled.div`
  flex: 1;
  margin-right: 1rem;
`

const PointsContainer = styled.div`
  margin-right: 1.5rem;
  width: 5rem;
`

const QuizContent = styled.div`
  padding: 1rem;
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  margin-top: 0.25rem !important;
`

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

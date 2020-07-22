import React from "react"
import { ItemAnswer } from "../../../../types/Answer"
import { Typography } from "@material-ui/core"
import styled from "styled-components"

export const ItemAnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const StyledTypo = styled(Typography)`
  display: flex !important;
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
  width: 100%;
`

export const AnswerContainer = styled.div`
  display: flex;
  padding: 1rem;
  width: 100%;
`

export interface SingleAnswerProps {
  itemAnswer: ItemAnswer
}

export const SingleItemAnswer = ({ itemAnswer }: SingleAnswerProps) => {
  return (
    <>
      <ItemAnswerContainer>
        <StyledTypo variant="subtitle1">
          Quiz Item ID: {itemAnswer.quizItemId}
        </StyledTypo>
        {itemAnswer.correct ? (
          <StyledTypo>Correct</StyledTypo>
        ) : (
          <StyledTypo>Incorrect</StyledTypo>
        )}
        <StyledTypo variant="subtitle1">Answer: </StyledTypo>
        <AnswerContainer>
          <Typography variant="overline">{itemAnswer.textData}</Typography>
        </AnswerContainer>
      </ItemAnswerContainer>
    </>
  )
}

export default SingleItemAnswer

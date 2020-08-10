import React from "react"
import { ItemAnswer } from "../../../../types/Answer"
import { Typography } from "@material-ui/core"
import styled from "styled-components"

export const ItemAnswerContainer = styled.div`
  display: flex;
  width: 100%;
`

export const ItemAnswerTextContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 99%;
`

export const StyledTypo = styled(Typography)`
  display: flex !important;
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
  width: 100%;
`

export const AnswerText = styled(Typography)`
  white-space: pre-line;
`

export const AnswerContainer = styled.div`
  display: flex;
  padding: 1rem;
  width: 100%;
`

export const CorrectAnswer = styled.div`
  display: flex;
  width: 1%;
  height: 95%;
  background: #4caf50 !important;
`

export const IncorrectAnswer = styled.div`
  display: flex;
  width: 1%;
  height: 95%;
  background: #f44336 !important;
`

export interface SingleAnswerProps {
  itemAnswer: ItemAnswer
}

export const SingleItemAnswer = ({ itemAnswer }: SingleAnswerProps) => {
  return (
    <>
      <ItemAnswerContainer>
        {itemAnswer.correct ? <CorrectAnswer /> : <IncorrectAnswer />}
        <ItemAnswerTextContainer>
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
            {itemAnswer && itemAnswer.textData !== null ? (
              <AnswerText>{itemAnswer.textData.trim()}</AnswerText>
            ) : (
              ""
            )}
          </AnswerContainer>
        </ItemAnswerTextContainer>
      </ItemAnswerContainer>
    </>
  )
}

export default SingleItemAnswer

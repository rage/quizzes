import React from "react"
import { AnswerElement } from "../../../../types/Answer"
import { Typography, Divider } from "@material-ui/core"
import styled from "styled-components"

export const StyledText = styled(Typography)`
  display: flex;
  margin-right: 0.5rem !important;
`

export const StyledValue = styled(Typography)`
  display: flex;
  margin-left: 0.5rem !important;
`

export const AnswerElementContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 1rem;
`

export const QuestionContainer = styled.div`
  display: flex;
  width: 100%;
`

export const AnswerContainer = styled.div`
  display: flex;
  width: 100%;
`

export const StyledDivider = styled(Divider)`
  display: flex !important;
  color: blue !important;
  margin: 0.5rem !important;
  width: 100%;
`

export interface reviewAnswerProps {
  answerElement: AnswerElement
}

export const ReviewAnswerElement = ({ answerElement }: reviewAnswerProps) => {
  console.log(answerElement)
  return (
    <>
      <AnswerElementContainer>
        <QuestionContainer>
          <StyledText>
            Question: {answerElement.peerReviewQuestionId}
          </StyledText>
        </QuestionContainer>
        <AnswerContainer>
          {answerElement.text !== null ? (
            <StyledText>Text: {answerElement.text}</StyledText>
          ) : (
            ""
          )}
          {answerElement.value !== null ? (
            <StyledValue>Value: {answerElement.value}</StyledValue>
          ) : (
            ""
          )}
        </AnswerContainer>
        <StyledDivider variant="middle" />
      </AnswerElementContainer>
    </>
  )
}

export default ReviewAnswerElement

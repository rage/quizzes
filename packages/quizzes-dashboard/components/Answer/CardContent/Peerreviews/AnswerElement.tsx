import React from "react"
import { AnswerElement } from "../../../../types/Answer"
import { Typography } from "@material-ui/core"
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
`

export interface reviewAnswerProps {
  answerElement: AnswerElement
}

export const ReviewAnswerElement = ({ answerElement }: reviewAnswerProps) => {
  return (
    <>
      <AnswerElementContainer>
        <StyledText>Text: {answerElement.text}</StyledText>
        <StyledValue>Value: {answerElement.value}</StyledValue>
      </AnswerElementContainer>
    </>
  )
}

export default ReviewAnswerElement

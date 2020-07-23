import React from "react"
import { Answer } from "../../../types/Answer"
import { Typography } from "@material-ui/core"
import styled from "styled-components"

export const StyledTypo = styled(Typography)`
  display: flex;
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
`

export interface AnswerOverViewProps {
  answer: Answer
}

export const AnswerOverView = ({ answer }: AnswerOverViewProps) => {
  return (
    <>
      <StyledTypo>User ID: {answer.userId}</StyledTypo>
      <StyledTypo>Status: {answer.status}</StyledTypo>
      <StyledTypo>
        Points:{" "}
        {answer.userQuizState
          ? answer.userQuizState.pointsAwarded
          : "No Points"}
      </StyledTypo>
    </>
  )
}

export default AnswerOverView

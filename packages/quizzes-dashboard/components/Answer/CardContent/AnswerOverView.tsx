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
      <StyledTypo>
        <strong>User ID: &nbsp;</strong> {answer.userId}
      </StyledTypo>
      <StyledTypo>
        <strong>Status: &nbsp; </strong> {answer.status}
      </StyledTypo>
      <StyledTypo>
        <strong>Points: &nbsp;</strong>
        {answer.userQuizState ? answer.userQuizState.pointsAwarded : "0"}
      </StyledTypo>
      <StyledTypo>
        <strong>Spam flags: &nbsp;</strong>
        {answer.userQuizState ? answer.userQuizState.spamFlags : ""}
      </StyledTypo>
    </>
  )
}

export default AnswerOverView

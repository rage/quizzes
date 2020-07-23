import React from "react"
import { Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import { Answer } from "../../../types/Answer"
import { changeAnswerStatus } from "../../../services/quizzes"

export const ButtonField = styled.div`
  padding: 1rem;
  display: flex;
  width: 100%;
  justify-content: space-around;
`

export const AcceptButton = styled(Button)`
  display: flex !important;
  border-color: green !important;
  border-width: 5px !important;
`

export const RejectButton = styled(Button)`
  display: flex !important;
  border-color: red !important;
  border-width: 5px !important;
`

export interface ManualReviewProps {
  answer: Answer
}

export const ManualReviewField = ({ answer }: ManualReviewProps) => {
  return (
    <>
      <ButtonField>
        <AcceptButton
          variant="outlined"
          onClick={() => changeAnswerStatus(answer.id, "confirmed")}
        >
          <Typography variant="overline">Accept</Typography>
        </AcceptButton>
        <RejectButton
          variant="outlined"
          onClick={() => changeAnswerStatus(answer.id, "rejected")}
        >
          <Typography variant="overline">Reject</Typography>
        </RejectButton>
      </ButtonField>
    </>
  )
}

export default ManualReviewField

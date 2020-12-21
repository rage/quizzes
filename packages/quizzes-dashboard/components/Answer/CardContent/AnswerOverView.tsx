import React, { useEffect } from "react"
import { Answer } from "../../../types/Answer"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { useAnswerListState } from "../../../contexts/AnswerListContext"

export interface AnswerOverViewProps {
  answer: Answer
}

export const StyledTypo = styled(Typography)`
  display: flex;
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
`

const OverviewWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const roundTo2DP = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const AnswerOverView = ({ answer }: AnswerOverViewProps) => {
  const formattedAnswerDate = answer.userQuizState?.createdAt
    .substring(0, 16)
    .replace("T", " ")

  const [{ handledAnswers }] = useAnswerListState()

  useEffect(() => {
    handledAnswers.forEach(a => {
      if (a.id === answer.id) {
        answer.status = a.status
      }
    })
  }, [handledAnswers])

  return (
    <OverviewWrapper>
      <StyledTypo>
        <strong>User ID: &nbsp;</strong> {answer.userId}
      </StyledTypo>
      <StyledTypo>
        <strong>Status: &nbsp; </strong> {answer.status}
      </StyledTypo>
      <StyledTypo>
        <strong>Points: &nbsp;</strong>
        {answer.userQuizState
          ? roundTo2DP(answer.userQuizState.pointsAwarded)
          : 0}
      </StyledTypo>
      <StyledTypo>
        <strong>Spam flags: &nbsp;</strong>
        {answer.userQuizState && answer.userQuizState.spamFlags}
      </StyledTypo>
      <StyledTypo>
        <strong>Answered: &nbsp;</strong>
        {formattedAnswerDate}
      </StyledTypo>
    </OverviewWrapper>
  )
}

export default AnswerOverView

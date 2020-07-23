import React from "react"
import { Answer } from "../../types/Answer"
import { Typography, Card } from "@material-ui/core"
import styled from "styled-components"
import { AnswerContent } from "./CardContent"

export const StyledAnswerCard = styled(Card)`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

export interface AnswerProps {
  answer: Answer
}

export const AnswerCard = ({ answer }: AnswerProps) => {
  return (
    <>
      <StyledAnswerCard>
        <AnswerContent answer={answer} />
      </StyledAnswerCard>
    </>
  )
}

export default AnswerCard

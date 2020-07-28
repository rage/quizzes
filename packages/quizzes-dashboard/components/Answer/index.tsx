import React from "react"
import { Answer } from "../../types/Answer"
import { Typography, Card } from "@material-ui/core"
import styled from "styled-components"
import { AnswerContent } from "./CardContent"

export const StyledAnswerCard = styled(Card)`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
`

export interface AnswerProps {
  answer: Answer
  expanded: boolean
}

export const AnswerCard = ({ answer, expanded }: AnswerProps) => {
  return (
    <>
      <StyledAnswerCard>
        <AnswerContent answer={answer} expanded={expanded} />
      </StyledAnswerCard>
    </>
  )
}

export default AnswerCard

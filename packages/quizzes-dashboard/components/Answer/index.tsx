import React, { useState, ReactChildren } from "react"
import { Answer } from "../../types/Answer"
import { Card } from "@material-ui/core"
import styled from "styled-components"
import { AnswerContent } from "./CardContent"

interface AdditionalAnswerCardProps {
  faded: boolean
  status: string
}

export const StyledAnswerCard = styled(Card)<AdditionalAnswerCardProps>`
  display: flex;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  padding: 2.5rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
  background-color: ${props => {
    let rgba = "0, 0, 0, 0.3"
    if (props.status === "confirmed") {
      rgba = "76, 175, 80, 0.2"
    }
    if (props.status === "rejected") {
      rgba = "244, 67, 54, 0.2"
    }
    return props.faded && `rgba(${rgba}) !important;`
  }};
`

export interface AnswerProps {
  answer: Answer
  expanded: boolean
}

export const AnswerCard = ({ answer, expanded }: AnswerProps) => {
  const [faded, setFaded] = useState(false)
  const [status, setStatus] = useState("")
  return (
    <>
      <StyledAnswerCard faded={faded} status={status}>
        <AnswerContent
          answer={answer}
          expanded={expanded}
          setFaded={setFaded}
          setStatus={setStatus}
        />
      </StyledAnswerCard>
    </>
  )
}

export default AnswerCard

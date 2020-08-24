import React, { useState, ReactChildren } from "react"
import { Answer } from "../../types/Answer"
import { Card, CardProps } from "@material-ui/core"
import styled from "styled-components"
import { AnswerContent } from "./CardContent"

interface AdditionalAnswerCardProps {
  faded: boolean
  status: string
}

export const StyledAnswerCard = styled(Card)<AdditionalAnswerCardProps>`
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
  background: ${props => {
    let rgba = "0, 0, 0, 0.3"
    if (props.status === "confirmed") {
      rgba = "0, 255, 0, 0.4"
    }
    if (props.status === "rejected") {
      rgba = "255, 0, 0, 0.4"
    }
    return props.faded && `linear-gradient(rgba(0,0,0,0.4), rgba(${rgba}));`
  }};
`

export interface AnswerProps {
  answer: Answer
  expanded: boolean
}

export const AnswerCard = ({ answer, expanded }: AnswerProps) => {
  const [faded, setFaded] = useState(false)
  const [status, setStatus] = useState("")
  console.log(status)
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

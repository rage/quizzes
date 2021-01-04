import React from "react"
import { Answer } from "../../../types/Answer"
import Link from "next/link"
import { Link as LinkTypography } from "@material-ui/core"
import styled from "styled-components"

export const AnswerLinkContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`

export interface AnswerLinkProps {
  answer: Answer
}

export const AnswerLink = ({ answer }: AnswerLinkProps) => {
  return (
    <AnswerLinkContainer>
      <Link href={`/quizzes/${answer.quizId}/answers/${answer.id}`}>
        <LinkTypography
          component="span"
          variant="body2"
          style={{ cursor: "pointer" }}
        >
          View Answer: {answer.id}
        </LinkTypography>
      </Link>
    </AnswerLinkContainer>
  )
}

export default AnswerLink

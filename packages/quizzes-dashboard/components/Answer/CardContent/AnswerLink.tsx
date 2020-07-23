import React from "react"
import { Answer } from "../../../types/Answer"
import Link from "next/link"
import { Typography } from "@material-ui/core"
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
      <Link
        href={{
          pathname: "/quizzes/[quizId]/answers/[answerId]",
        }}
        as={`/quizzes/${answer.quizId}/answers/${answer.id}`}
      >
        <a>
          <Typography>View Answer: {answer.id}</Typography>
        </a>
      </Link>
    </AnswerLinkContainer>
  )
}

export default AnswerLink

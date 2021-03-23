import React from "react"
import Link from "next/link"
import { Link as LinkTypography } from "@material-ui/core"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Answer } from "../../../types/Answer"

export const AnswerLinkContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 100%;
`

export interface AnswerLinkProps {
  answer: Answer
}

export const AnswerLink = ({ answer }: AnswerLinkProps) => {
  const route = useRouter()
  const singularAnswerIsBeingViewed = route.query.answerId ? true : false
  if (singularAnswerIsBeingViewed) return null
  const answerOverviewHref = `/quizzes/${answer.quizId}/answers/${answer.id}/overview`

  return (
    <AnswerLinkContainer>
      <Link href={answerOverviewHref} passHref>
        <LinkTypography
          component="a"
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

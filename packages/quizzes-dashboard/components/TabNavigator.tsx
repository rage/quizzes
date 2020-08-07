import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import Link from "next/link"

const LinkWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between !important;
  padding: 1rem;
`

const LinkContainer = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
`

interface NavigatorProps {
  quizId: string
}

export const TabNavigator = ({ quizId }: NavigatorProps) => {
  return (
    <LinkWrapper>
      <LinkContainer>
        <Link href="/quizzes/[quizId]/edit" as={`/quizzes/${quizId}/edit`}>
          <a>
            <Typography>Edit quiz</Typography>
          </a>
        </Link>
      </LinkContainer>
      <LinkContainer>
        <Link
          href="/quizzes/[quizId]/answers/all"
          as={`/quizzes/${quizId}/answers/all`}
        >
          <a>
            <Typography>All answers</Typography>
          </a>
        </Link>
      </LinkContainer>
      <LinkContainer>
        <Link
          href="/quizzes/[quizId]/answers/requiring-attention"
          as={`/quizzes/${quizId}/answers/requiring-attention`}
        >
          <a>
            <Typography>Answers requiring attention</Typography>
          </a>
        </Link>
      </LinkContainer>
    </LinkWrapper>
  )
}

export default TabNavigator

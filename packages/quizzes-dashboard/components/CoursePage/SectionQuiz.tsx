import React from "react"

import Link from "next/link"
import styled from "styled-components"

import {
  Typography,
  Card,
  CardContent,
  Button,
  Badge,
  CardHeader,
} from "@mui/material"

import { useUserAbilities } from "../../hooks/useUserAbilities"
import { Quiz } from "../../types/Quiz"
interface quizProps {
  quiz: Quiz
  requiringAttention: number
}

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: no-wrap;
  @media only screen and (max-width: 535px) {
    flex-wrap: wrap;
    justify-content: space-around;
  }
`

const TitleContainer = styled.div`
  display: flex;
  width: 60%;
  margin-right: 0.5px;
  @media only screen and (max-width: 535px) {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-right: 8px;
  margin-bottom: 8px;
  float: right;
  width: 35%;
  @media only screen and (max-width: 535px) {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const QuizCard = styled(Card)`
  margin-bottom: 1rem;
`

const StyledType = styled(Typography)`
  color: #f44336 !important;
`

const QuizLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`

export const QuizOfSection = ({ quiz, requiringAttention }: quizProps) => {
  const title = quiz.title
  const types = Array.from(new Set(quiz.items.map((item) => item.type)))
  const { userAbilities } = useUserAbilities(
    quiz?.courseId ?? "",
    "user-abilities",
  )

  const quizType = types.length > 0 ? types.join(", ") : "unknown"

  return (
    <QuizCard>
      <QuizLink href={`/quizzes/${quiz.id}/overview`}>
        <CardHeader title={title} subheader={quizType} />
      </QuizLink>
      <ButtonContainer>
        <Badge
          color="error"
          badgeContent={requiringAttention}
          invisible={requiringAttention === undefined}
        >
          <Button
            variant="outlined"
            component={Link}
            href={`/quizzes/${quiz.id}/answers-requiring-attention`}
          >
            <Typography>Answers requiring attention</Typography>
          </Button>
        </Badge>
        {userAbilities?.includes("edit") && (
          <Button
            variant="outlined"
            component={Link}
            href={`/quizzes/${quiz.id}/edit`}
          >
            <Typography>Edit quiz</Typography>
          </Button>
        )}
      </ButtonContainer>
    </QuizCard>
  )
}

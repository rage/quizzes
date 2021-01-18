import { Typography, Card, CardContent, Button, Badge } from "@material-ui/core"
import Link from "next/link"
import React from "react"
import styled from "styled-components"
import { Quiz } from "../../types/Quiz"
import { useUserAbilities } from "../../hooks/useUserAbilities"
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
  width: 40%;
  justify-content: space-between;
  margin-left: 0.5px;
  @media only screen and (max-width: 535px) {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const QuizCard = styled(Card)`
  margin-bottom: 1rem;
`

const QuizLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const StyledType = styled(Typography)`
  color: #f44336 !important;
`

export const QuizOfSection = ({ quiz, requiringAttention }: quizProps) => {
  const title = quiz.title
  const types = Array.from(new Set(quiz.items.map(item => item.type)))
  const {
    userAbilities,
    userAbilitiesLoading,
    userAbilitiesError,
  } = useUserAbilities(quiz?.courseId ?? "", "user-abilities")

  return (
    <Link href={`/quizzes/${quiz.id}/overview`}>
      <QuizLink>
        <QuizCard>
          <CardContent>
            <TitleWrapper>
              <TitleContainer>
                <Typography color="inherit" variant="body1">
                  {title}
                </Typography>
              </TitleContainer>
              <ButtonContainer>
                <Badge
                  color="error"
                  badgeContent={requiringAttention}
                  invisible={requiringAttention === undefined}
                >
                  <Link
                    href={`/quizzes/${quiz.id}/answers-requiring-attention`}
                  >
                    <Button variant="outlined">
                      <Typography>Answers requiring attention</Typography>
                    </Button>
                  </Link>
                </Badge>
                {userAbilities?.includes("edit") && (
                  <Link href={`/quizzes/${quiz.id}/edit`}>
                    <Button variant="outlined">
                      <Typography>Edit quiz</Typography>
                    </Button>
                  </Link>
                )}
              </ButtonContainer>
            </TitleWrapper>
            {types.length > 0 ? (
              <div>
                [{" "}
                {types.map(type => (
                  <StyledType key={type} variant="overline">
                    {type}{" "}
                  </StyledType>
                ))}
                ]
              </div>
            ) : (
              ""
            )}
          </CardContent>
        </QuizCard>
      </QuizLink>
    </Link>
  )
}

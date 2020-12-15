import React from "react"
import { Quiz } from "../../types/Quiz"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

interface QuizTitleProps {
  quiz: Quiz
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const TitleContainer = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-around;
  width: 100%;
  margin: 4rem;
`

export const QuizTitle = ({ quiz }: QuizTitleProps) => {
  return (
    <>
      <HeaderContainer>
        <TitleContainer>
          <Typography variant="h2">{quiz.title}</Typography>
        </TitleContainer>
      </HeaderContainer>
    </>
  )
}

export default QuizTitle

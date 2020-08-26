import React from "react"
import { Course, Quiz } from "../../types/Quiz"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

interface QuizTitleProps {
  quiz: Quiz
  course: Course
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
`
const CourseName = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`
export const QuizTitle = ({ quiz, course }: QuizTitleProps) => {
  return (
    <>
      <HeaderContainer>
        <CourseName>
          <Typography>{course.title}</Typography>
        </CourseName>
        <Typography>
          Part {quiz.part}, Section {quiz.section}
        </Typography>
        <TitleContainer>
          <Typography variant="h2">{quiz.title}</Typography>
        </TitleContainer>
      </HeaderContainer>
    </>
  )
}

export default QuizTitle

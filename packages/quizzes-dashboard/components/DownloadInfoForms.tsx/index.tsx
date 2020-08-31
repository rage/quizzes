import React from "react"
import styled from "styled-components"
import { QuizInfoForm } from "./QuizInfoForm"
import PeerreviewInfoForm from "./PeerreviewInfoForm"
import AnswerInfoForm from "./AnswerInfoForm"
import { Quiz, Course } from "../../types/Quiz"

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`

export interface DownloadInfoFormProps {
  quiz: Quiz
  course: Course
}

export const DownloadInfoForms = ({ quiz, course }: DownloadInfoFormProps) => {
  return (
    <>
      <FormContainer>
        <QuizInfoForm
          quizId={quiz.id}
          quizName={quiz.title}
          courseName={course.title}
        />
        <PeerreviewInfoForm
          quizId={quiz.id}
          quizName={quiz.title}
          courseName={course.title}
        />
        <AnswerInfoForm
          quizId={quiz.id}
          quizName={quiz.title}
          courseName={course.title}
        />
      </FormContainer>
    </>
  )
}

export default DownloadInfoForms

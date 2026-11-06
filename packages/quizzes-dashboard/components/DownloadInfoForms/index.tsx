import React from "react"

import styled from "styled-components"

import { Button } from "@mui/material"

import { Quiz, Course } from "../../types/Quiz"
import AnswerInfoForm from "./AnswerInfoForm"
import PeerReviewInfoForm from "./PeerReviewInfoForm"
import { QuizInfoForm } from "./QuizInfoForm"

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`

export const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

export const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`

export interface DownloadInfoFormProps {
  quiz: Quiz
  course: Course
}

export const DownloadInfoForms = ({ quiz, course }: DownloadInfoFormProps) => {
  return (
    <>
      <FormContainer>
        <QuizInfoForm quizId={quiz.id} quizName={quiz.title} course={course} />
        <PeerReviewInfoForm
          quizId={quiz.id}
          quizName={quiz.title}
          course={course}
        />
        <AnswerInfoForm
          quizId={quiz.id}
          quizName={quiz.title}
          course={course}
        />
      </FormContainer>
    </>
  )
}

export default DownloadInfoForms

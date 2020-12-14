import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { checkStore } from "../../services/tmcApi"
import { downloadQuizInfo } from "../../services/quizzes"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`

interface QuizInfoFormProps {
  quizId: string
  quizName: string
  courseName: string
}

export const QuizInfoForm = ({
  quizId,
  quizName,
  courseName,
}: QuizInfoFormProps) => {
  const handleQuizInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const res = await downloadQuizInfo(quizId, quizName, courseName)
    const blob = new Blob([res.data], { type: res.headers["content-type"] })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = `quiz-info-${quizName}-${courseName}-${new Date()
      .toLocaleString()
      .replace(/[ , _]/g, "-")}`
    link.click()
  }

  return (
    <StyledForm onSubmit={event => handleQuizInfoDownload(event)}>
      <SubmitButton type="submit" variant="outlined">
        Download quiz info
      </SubmitButton>
    </StyledForm>
  )
}

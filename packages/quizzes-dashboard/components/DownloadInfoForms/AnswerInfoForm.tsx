import React from "react"
import { Button } from "@material-ui/core"
import styled from "styled-components"
import { downloadAnswerInfo } from "../../services/quizzes"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`

interface AnswerInfoFormProps {
  quizId: string
  quizName: string
  courseName: string
}

export const AnswerInfoForm = ({
  quizId,
  quizName,
  courseName,
}: AnswerInfoFormProps) => {
  const handleAnswerInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const res = await downloadAnswerInfo(quizId, quizName, courseName)
    const blob = new Blob([res.data], { type: res.headers["content-type"] })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = `answer-info-${quizName}-${courseName}-${new Date()
      .toLocaleString()
      .replace(/[ , _]/g, "-")}`
    link.click()
  }
  return (
    <StyledForm onSubmit={handleAnswerInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download answer info
      </SubmitButton>
    </StyledForm>
  )
}

export default AnswerInfoForm

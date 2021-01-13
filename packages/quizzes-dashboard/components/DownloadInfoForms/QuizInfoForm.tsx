import React, { useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { downloadQuizInfo } from "../../services/quizzes"
import { HOST, createAndSubmitDownloadForm } from "./util"

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
    const { downloadUrl, username } = res.data
    const completeDownloadUrl = HOST + downloadUrl
    createAndSubmitDownloadForm(
      username,
      completeDownloadUrl,
      quizName,
      courseName,
    )
  }

  return (
    <StyledForm onSubmit={handleQuizInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download quiz info
      </SubmitButton>
    </StyledForm>
  )
}

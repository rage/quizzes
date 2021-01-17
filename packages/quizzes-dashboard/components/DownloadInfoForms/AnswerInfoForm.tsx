import React from "react"
import { Button } from "@material-ui/core"
import styled from "styled-components"
import { downloadAnswerInfo } from "../../services/quizzes"
import { createAndSubmitDownloadForm, HOST } from "./util"
import { Course } from "../../types/Quiz"

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
  course: Course
}

export const AnswerInfoForm = ({
  quizId,
  quizName,
  course,
}: AnswerInfoFormProps) => {
  const handleAnswerInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const { id: courseId, title: courseName } = course
    const res = await downloadAnswerInfo(quizId, quizName, courseId)
    const { downloadUrl, username } = res.data
    const completeDownloadUrl = HOST + downloadUrl
    createAndSubmitDownloadForm(
      username,
      completeDownloadUrl,
      quizName,
      courseId,
      courseName,
    )
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

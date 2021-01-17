import React from "react"
import { downloadQuizInfo } from "../../services/quizzes"
import { HOST, createAndSubmitDownloadForm } from "./util"
import { StyledForm, SubmitButton } from "./"
import { DownloadFormProps } from "../../types/Quiz"

export const QuizInfoForm = ({
  quizId,
  quizName,
  course,
}: DownloadFormProps) => {
  const handleQuizInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const { id: courseId, title: courseName } = course
    const res = await downloadQuizInfo(quizId, quizName, courseId)
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
    <StyledForm onSubmit={handleQuizInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download quiz info
      </SubmitButton>
    </StyledForm>
  )
}

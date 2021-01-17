import React from "react"
import { downloadPeerReviewInfo } from "../../services/quizzes"
import { DownloadFormProps } from "../../types/Quiz"
import { createAndSubmitDownloadForm, HOST } from "./util"
import { StyledForm, SubmitButton } from "./"

export const PeerReviewInfoForm = ({
  quizId,
  quizName,
  course,
}: DownloadFormProps) => {
  const handlePeerReviewInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const { id: courseId, title: courseName } = course
    const res = await downloadPeerReviewInfo(quizId, quizName, courseId)
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
    <StyledForm onSubmit={handlePeerReviewInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download peer review info
      </SubmitButton>
    </StyledForm>
  )
}

export default PeerReviewInfoForm

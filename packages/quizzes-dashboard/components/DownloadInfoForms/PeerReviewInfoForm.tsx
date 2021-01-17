import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { downloadPeerReviewInfo } from "../../services/quizzes"
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

interface PeerReviewInfoFormProps {
  quizId: string
  quizName: string
  course: Course
}

export const PeerReviewInfoForm = ({
  quizId,
  quizName,
  course,
}: PeerReviewInfoFormProps) => {
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

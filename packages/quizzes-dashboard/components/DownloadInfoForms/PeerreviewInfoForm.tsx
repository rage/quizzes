import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { downloadPeerReviewInfo } from "../../services/quizzes"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`

interface PeerreviewInfoFormProps {
  quizId: string
  quizName: string
  courseName: string
}

export const PeerreviewInfoForm = ({
  quizId,
  quizName,
  courseName,
}: PeerreviewInfoFormProps) => {
  const handlePeerReviewInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const res = await downloadPeerReviewInfo(quizId, quizName, courseName)
    const blob = new Blob([res.data], { type: res.headers["content-type"] })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = `quiz-peerreview-info-${quizName}-${courseName}-${new Date()
      .toLocaleString()
      .replace(/[ , _]/g, "-")}`
    link.click()
  }

  return (
    <StyledForm onSubmit={handlePeerReviewInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download peerreview info
      </SubmitButton>
    </StyledForm>
  )
}

export default PeerreviewInfoForm

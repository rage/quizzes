import React from "react"
import { checkStore } from "../../services/tmcApi"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

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
  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes2.mooc.fi"
  }

  const userInfo = checkStore()

  return (
    <StyledForm
      method="post"
      action={
        HOST + `/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`
      }
    >
      <input
        value={userInfo?.accessToken}
        type="hidden"
        name="token"
        id="token"
      />
      <input value={quizName} type="hidden" name="quizName" />
      <input value={courseName} type="hidden" name="courseName" />
      <SubmitButton type="submit" variant="outlined">
        Download peerreview info
      </SubmitButton>
    </StyledForm>
  )
}

export default PeerreviewInfoForm

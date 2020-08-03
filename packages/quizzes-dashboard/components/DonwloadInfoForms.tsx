import React from "react"
import styled from "styled-components"
import { Button } from "@material-ui/core"
import { checkStore } from "../services/tmcApi"

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`
const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`

export interface DownloadInfoFormProps {
  quizId: string
}

export const DownloadInfoForms = ({ quizId }: DownloadInfoFormProps) => {
  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes2.mooc.fi"
  }

  const userInfo = checkStore()

  return (
    <>
      <FormContainer>
        <StyledForm
          method="post"
          action={
            HOST + `/api/v2/dashboard/quizzes/${quizId}/download-quiz-info`
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download quiz info
          </SubmitButton>
        </StyledForm>
        <StyledForm
          method="post"
          action={
            HOST +
            `/api/v2/dashboard/quizzes/${quizId}/download-peerreview-info`
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download peerreview info
          </SubmitButton>
        </StyledForm>
        <StyledForm
          method="post"
          action={
            HOST + `/api/v2/dashboard/quizzes/${quizId}/download-answer-info`
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download answer info
          </SubmitButton>
        </StyledForm>
      </FormContainer>
    </>
  )
}

import React from "react"
import { checkStore } from "../../services/tmcApi"
import { Button } from "@material-ui/core"
import styled from "styled-components"

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
  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes.mooc.fi"
  }

  const userInfo = checkStore()

  return (
    <StyledForm
      method="post"
      action={HOST + `/api/v2/dashboard/quizzes/${quizId}/download-answer-info`}
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
        Download answer info
      </SubmitButton>
    </StyledForm>
  )
}

export default AnswerInfoForm

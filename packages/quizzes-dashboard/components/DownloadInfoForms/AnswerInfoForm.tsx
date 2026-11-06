import React from "react"

import { downloadAnswerInfo } from "../../services/quizzes"
import { checkStore, getProfile } from "../../services/tmcApi"
import { DownloadFormProps } from "../../types/Quiz"
import { StyledForm, SubmitButton } from "./"
import { createAndSubmitDownloadForm, HOST } from "./util"

export const AnswerInfoForm = ({
  quizId,
  quizName,
  course,
}: DownloadFormProps) => {
  const handleAnswerInfoDownload = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const { id: courseId, title: courseName } = course
    const res = await downloadAnswerInfo(quizId, quizName, courseId)
    const { downloadUrl } = res.data
    const completeDownloadUrl = HOST + downloadUrl
    const storeInfo = checkStore()
    if (storeInfo?.accessToken) {
      const userProfile = await getProfile(storeInfo?.accessToken)
      const userId = userProfile.id.toString()
      createAndSubmitDownloadForm(
        userId,
        completeDownloadUrl,
        quizName,
        courseId,
        courseName,
      )
    }
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

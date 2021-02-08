import React from "react"
import { downloadPeerReviewInfo } from "../../services/quizzes"
import { DownloadFormProps } from "../../types/Quiz"
import { createAndSubmitDownloadForm, HOST } from "./util"
import { StyledForm, SubmitButton } from "./"
import { checkStore, getProfile } from "../../services/tmcApi"

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
    <StyledForm onSubmit={handlePeerReviewInfoDownload}>
      <SubmitButton type="submit" variant="outlined">
        Download peer review info
      </SubmitButton>
    </StyledForm>
  )
}

export default PeerReviewInfoForm

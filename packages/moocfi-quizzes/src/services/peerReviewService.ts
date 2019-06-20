import axios from "axios"
import { PeerReview, UserQuizState } from "../../../common/src/models"

export const getPeerReviewInfo = async (
  quizId: string,
  languageId: string,
  baseUrl: string,
  accessToken: string,
): Promise<any[]> => {
  const response = await axios.get(
    `${baseUrl}/api/v1/quizzes/peerreview/${quizId}/${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

export const postSpamFlag = async (
  quizAnswerId: string,
  baseUrl: string,
  accessToken: string,
) => {
  let response = await axios.post(
    `${baseUrl}/api/v1/quizzes/spamflag`,
    { quizAnswerId },
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const postPeerReview = async (
  peerReview: PeerReview,
  baseUrl: string,
  accessToken: string,
): Promise<{ userQuizState: UserQuizState }> => {
  const response = await axios.post(
    `${baseUrl}/api/v1/quizzes/peerreview`,
    peerReview,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

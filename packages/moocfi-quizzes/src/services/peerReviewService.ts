import axios from "axios"
import BASE_URL from "../config"
import { PeerReviewAnswer } from "../state/peerReviews/reducer"
import { UserQuizState } from "../state/user/reducer"

export const getPeerReviewInfo = async (
  quizId: string,
  languageId: string,
  accessToken: string,
): Promise<any[]> => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/quizzes/peerreview/${quizId}/${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

export const postSpamFlag = async (
  quizAnswerId: string,
  accessToken: string,
) => {
  let response = await axios.post(
    `${BASE_URL}/api/v1/quizzes/spamflag`,
    { quizAnswerId },
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const postPeerReview = async (
  peerReview: PeerReviewAnswer,
  accessToken: string,
): Promise<{ userQuizState: UserQuizState }> => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/quizzes/peerreview`,
    peerReview,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

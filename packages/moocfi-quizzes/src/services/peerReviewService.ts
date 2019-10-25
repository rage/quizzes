import axios from "axios"
import BASE_URL from "../config"
import { QuizAnswer, PeerReviewAnswer, UserQuizState } from "../modelTypes"

export const getPeerReviewInfo = async (
  quizId: string,
  languageId: string,
  accessToken: string,
  address?: string,
): Promise<QuizAnswer[]> => {
  const response = await axios.get(
    `${address || BASE_URL}/api/v1/quizzes/peerreview/${quizId}/${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

type SpamFlag = {
  id: string
  userId: number
  quizAnswerId: number
}

export const postSpamFlag = async (
  quizAnswerId: string,
  accessToken: string,
  address?: string,
): Promise<SpamFlag> => {
  let response = await axios.post(
    `${address || BASE_URL}/api/v1/quizzes/spamflag`,
    { quizAnswerId },
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const postPeerReview = async (
  peerReview: PeerReviewAnswer,
  accessToken: string,
  address?: string,
): Promise<{ userQuizState: UserQuizState }> => {
  const response = await axios.post(
    `${address || BASE_URL}/api/v1/quizzes/peerreview`,
    peerReview,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

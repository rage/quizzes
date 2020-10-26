import axios from "axios"
import BASE_URL from "../config"
import {
  QuizAnswer,
  PeerReviewAnswer,
  UserQuizState,
  IReceivedPeerReview,
} from "../modelTypes"

export const getPeerReviewCandidates = async (
  quizId: string,
  languageId: string,
  accessToken: string,
  address?: string,
): Promise<QuizAnswer[]> => {
  const response = await axios.get(
    `${address || BASE_URL}/api/v2/widget/answers/${quizId}/get-candidates`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

export const getReceivedReviews = async (
  quizAnswerId: string,
  accessToken: string,
  address?: string,
): Promise<Array<IReceivedPeerReview>> => {
  const response = await axios.get(
    `${address || BASE_URL}/api/v2/widget/answers/${quizAnswerId}/peer-reviews`,
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
    `${address || BASE_URL}/api/v2/widget/answers/report-spam`,
    { quizAnswerId },
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const postPeerReview = async (
  peerReview: PeerReviewAnswer,
  accessToken: string,
  address?: string,
): Promise<{ quizAnswer: QuizAnswer; userQuizState: UserQuizState }> => {
  const response = await axios.post(
    `${address || BASE_URL}/api/v2/widget/answers/give-review`,
    peerReview,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

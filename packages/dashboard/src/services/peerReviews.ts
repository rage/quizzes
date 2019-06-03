import axios from "axios"

export const getPeerReviews = async (answerId, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/peerreview/received/${answerId}`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  return response.data
}

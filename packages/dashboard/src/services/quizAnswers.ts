import axios from "axios"

export const getQuizAnswers = async (quizId, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/answer/attention?quizId=${quizId}&attention=false`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  return response.data
}

export const getAttentionRequiringQuizAnswers = async (quizId, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/answer/attention?quizId=${quizId}&attention=true`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  console.log("Response in answer service: ", response)
  return response.data
}

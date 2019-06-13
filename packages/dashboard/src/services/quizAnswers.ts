import axios from "axios"

export const getQuizAnswers = async (
  quizId: string,
  user: any,
  skip: number,
  limit: number,
) => {
  const response = await axios.get(
    `/api/v1/quizzes/answer/attention?quizId=${quizId}&attention=false&skip=${skip}&limit=${limit}`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  return response.data
}

export const updateQuizAnswerStatus = async (
  quizAnswerId: string,
  newStatus: string,
  user: any,
) => {
  const response = await axios.post(
    `/api/v1/quizzes/answer/${quizAnswerId}`,
    {
      newStatus,
    },
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )
  return response.data
}

export const getAttentionRequiringQuizAnswers = async (
  quizId: string,
  user: any,
  skip: number,
  limit: number,
) => {
  const response = await axios.get(
    `/api/v1/quizzes/answer/attention?quizId=${quizId}&attention=true&skip=${skip}&limit=${limit}`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  return response.data
}

export const getTotalNumberOfAnswers = async (quizId: string, user: any) => {
  const response = await axios.get(
    `/api/v1/quizzes/answer/counts?quizId=${quizId}`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )
  return response.data
}

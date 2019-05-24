import axios from "axios"

export const getQuizzes = async (course, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/?courseId=${course}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
    { headers: { authorization: `Bearer ${user.accessToken}` } },
  )
  return response.data
}

export const getOddAnswerCountsByQuizzes = async user => {
  const response = await axios.get(`/api/v1/quizzes/answer/counts`, {
    headers: { authorization: `Bearer ${user.accessToken}` },
  })
  console.log("Response in quizzes service: ", response)

  return response.data
}

export const post = async (quiz, user) => {
  const response = await axios.post(`/api/v1/quizzes`, quiz, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${user.accessToken}`,
    },
  })
  return response.data
}

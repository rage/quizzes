import axios from "axios"

export const getQuizzes = async (course, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/?courseId=${course}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
    { headers: { authorization: `Bearer ${user.accessToken}` } },
  )
  return response.data
}

export const getAttentionAnswerCountsByQuizzes = async user => {
  const response = await axios.get(`/api/v1/quizzes/answer/counts`, {
    headers: { authorization: `Bearer ${user.accessToken}` },
  })
  return response.data
}

export const getAnswersDetailedData = async (quizId, user) => {
  const response = await axios.get(`/api/v1/quizzes/answer/data/${quizId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${user.accessToken}`,
    },
  })
  return response.data
}

export const getPeerReviewsDetailedData = async (quizId, user) => {
  const response = await axios.get(
    `/api/v1/quizzes/peerreview/data/${quizId}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
  return response.data.map(peerReviewRow => ({
    ...peerReviewRow,
    rejected_quiz_answer_ids:
      peerReviewRow.rejected_quiz_answer_ids.length === 1
        ? peerReviewRow.rejected_quiz_answer_ids[0]
        : JSON.stringify(peerReviewRow.rejected_quiz_answer_ids),
  }))
}

export const getQuizInformationDetailedData = async (quizId, user) => {
  const response = await axios.get(`/api/v1/quizzes/data/${quizId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${user.accessToken}`,
    },
  })
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

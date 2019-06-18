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

export const getDetailedEverythingData = async (quizId, user) => {
  const promiseQuizPlainAnswers = axios.get(
    `/api/v1/quizzes/answer/data/${quizId}/plainAnswers`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promiseQuizPlainItemAnswers = axios.get(
    `/api/v1/quizzes/answer/data/${quizId}/plainItemAnswers`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promiseQuizPlainOptionAnswers = axios.get(
    `/api/v1/quizzes/answer/data/${quizId}/plainOptionAnswers`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainPeerReviews = axios.get(
    `/api/v1/quizzes/peerreview/data/${quizId}/plainPeerReviews`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainPeerReviewQuestionAnswers = axios.get(
    `/api/v1/quizzes/peerreview/data/${quizId}/plainAnswers`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainQuizInfo = axios.get(
    `/api/v1/quizzes/data/${quizId}/plainQuizInfo`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainQuizItems = axios.get(
    `/api/v1/quizzes/data/${quizId}/plainQuizItems`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainQuizOptions = axios.get(
    `/api/v1/quizzes/data/${quizId}/plainQuizOptions`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainQuizPeerReviewCollections = axios.get(
    `/api/v1/quizzes/data/${quizId}/plainPeerReviewCollections`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const promisePlainQuizPeerReviewQuestions = axios.get(
    `/api/v1/quizzes/data/${quizId}/plainPeerReviewQuestions`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const [
    responseQuizPlainAnswers,
    responseQuizPlainItemAnswers,
    responseQuizPlainOptionAnswers,
    responsePlainPeerReviews,
    responsePlainPeerReviewQuestionAnswers,
    responsePlainQuizInfo,
    responsePlainQuizItems,
    responsePlainQuizOptions,
    responsePlainQuizPeerReviewCollections,
    responsePlainQuizPeerReviewQuestions,
  ] = [
    await promiseQuizPlainAnswers,
    await promiseQuizPlainItemAnswers,
    await promiseQuizPlainOptionAnswers,
    await promisePlainPeerReviews,
    await promisePlainPeerReviewQuestionAnswers,
    await promisePlainQuizInfo,
    await promisePlainQuizItems,
    await promisePlainQuizOptions,
    await promisePlainQuizPeerReviewCollections,
    await promisePlainQuizPeerReviewQuestions,
  ]

  return {
    answers: {
      plainAnswers: responseQuizPlainAnswers.data,
      plainItemAnswers: responseQuizPlainItemAnswers.data,
      plainOptionAnswers: responseQuizPlainOptionAnswers.data,
    },
    peerReviews: {
      plainPeerReviews: responsePlainPeerReviews.data.map(peerReviewRow => ({
        ...peerReviewRow,
        rejected_quiz_answer_ids:
          peerReviewRow.rejected_quiz_answer_ids.length === 1
            ? peerReviewRow.rejected_quiz_answer_ids[0]
            : JSON.stringify(peerReviewRow.rejected_quiz_answer_ids),
      })),
      plainPeerReviewQuestionAnswers:
        responsePlainPeerReviewQuestionAnswers.data,
    },
    quizInfo: {
      plainInfo: responsePlainQuizInfo.data,
      plainItems: responsePlainQuizItems.data,
      plainOptions: responsePlainQuizOptions.data,
      plainPeerReviewCollections: responsePlainQuizPeerReviewCollections.data,
      plainPeerReviewQuestions: responsePlainQuizPeerReviewQuestions.data,
    },
  }
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

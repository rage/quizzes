import axios from "axios"
import BASE_URL from "../config"
import { Quiz, QuizAnswer, UserQuizState } from "../modelTypes"

export type QuizResponse = {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
}

export const getQuizInfo = async (
  id: string,
  accessToken?: string,
  address?: string,
): Promise<QuizResponse | Quiz> => {
  const response = accessToken
    ? await axios.get(`${address || BASE_URL}/api/v2/widget/quizzes/${id}`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
    : await axios.get(
        `${address || BASE_URL}/api/v2/widget/quizzes/${id}/preview`,
      )

  return response.data
}

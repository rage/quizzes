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
  fullInfo?: boolean,
): Promise<QuizResponse | Quiz> => {
  const parameterEnding = fullInfo ? "" : "?fullInfo=false"

  const response = accessToken
    ? await axios.get(
        `${address || BASE_URL}/api/v1/quizzes/${id}${parameterEnding}`,
        { headers: { authorization: `Bearer ${accessToken}` } },
      )
    : await axios.get(
        `${address || BASE_URL}/api/v1/quizzes/${id}${parameterEnding}`,
      )

  return response.data
}

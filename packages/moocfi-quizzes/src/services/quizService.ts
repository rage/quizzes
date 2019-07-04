import axios from "axios"
import BASE_URL from "../config"
import { Quiz, QuizAnswer, UserQuizState } from "../modelTypes"

type QuizResponse = {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
}

export const getQuizInfo = async (
  id: string,
  languageId: string,
  accessToken: string,
): Promise<QuizResponse> => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/quizzes/${id}?language=${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

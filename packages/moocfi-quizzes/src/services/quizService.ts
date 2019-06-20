import axios from "axios"
import { Quiz, UserQuizState } from "../../../common/src/models"
import BASE_URL from "../config"

type QuizResponse = {
  quiz: Quiz
  quizAnswer: any
  userQuizState: UserQuizState
}

export const getQuizInfo = async (
  id,
  languageId,
  accessToken,
): Promise<QuizResponse> => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/quizzes/${id}?language=${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

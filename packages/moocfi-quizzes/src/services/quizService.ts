import axios from "axios"
import { Quiz, UserQuizState } from "../../../common/src/models"

type QuizResponse = {
  quiz: Quiz
  quizAnswer: any
  userQuizState: UserQuizState
}

export const getQuizInfo = async (
  id,
  languageId,
  baseUrl,
  accessToken,
): Promise<QuizResponse> => {
  const response = await axios.get(
    `${baseUrl}/api/v1/quizzes/${id}?language=${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

import axios from "axios"
import { Quiz } from "../../../common/src/models"
import BASE_URL from "../config"
import { UserQuizState } from "../state/user/reducer"

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

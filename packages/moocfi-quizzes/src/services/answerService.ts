import axios from "axios"
import BASE_URL from "../config"
import { Quiz, QuizAnswer, UserQuizState } from "../modelTypes"

type AnswerResponse = {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
}

export const postAnswer = async (
  quizAnswer: QuizAnswer,
  accessToken: string,
): Promise<AnswerResponse> => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/quizzes/answer`,
    quizAnswer,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    },
  )

  return response.data
}

import axios from "axios"
import { Quiz, QuizAnswer, UserQuizState } from "../../../common/src/models"

type AnswerResponse = {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
}

export const postAnswer = async (
  quizAnswer: QuizAnswer,
  baseUrl: string,
  accessToken: string,
): Promise<AnswerResponse> => {
  const response = await axios.post(
    `${baseUrl}/api/v1/quizzes/answer`,
    quizAnswer,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    },
  )

  return response.data
}

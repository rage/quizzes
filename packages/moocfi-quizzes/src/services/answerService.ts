import axios from "axios"
import BASE_URL from "../config"
console.log("💩 ~ file: answerService.ts ~ line 3 ~ BASE_URL", BASE_URL)
import { Quiz, QuizAnswer, UserQuizState } from "../modelTypes"

type AnswerResponse = {
  quiz?: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
}

export const postAnswer = async (
  quizAnswer: QuizAnswer,
  accessToken: string,
  address?: string,
): Promise<AnswerResponse> => {
  const response = await axios.post(
    `${address || BASE_URL}/api/v2/widget/answer`,
    { ...quizAnswer, deleted: false },
    {
      headers: { authorization: `Bearer ${accessToken}` },
    },
  )

  return response.data
}

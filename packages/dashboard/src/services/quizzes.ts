import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await axios.get(
    "http://localhost:3000/api/v1/quizzes/",
  )
  return response.data
}

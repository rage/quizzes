import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"
import { quizzes } from "./mock"

export const getQuizzes = async course => {
  const response = await axios.get(
    `http://localhost:3000/api/v1/quizzes/?courseId=${course}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
  )
  return response.data
}

export const post = async quiz => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/quizzes",
    quiz,
    { headers: { "Content-Type": "application/json" } },
  )
  return response.data
}

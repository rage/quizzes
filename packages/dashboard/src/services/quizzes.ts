import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"
import { quizzes } from "./mock"

export const getQuizzes = async course => {
  const response = await axios.get(
    `http://localhost:3000/api/v1/quizzes/?courseId=${course}`,
  )
  /*response.data.map(q => {
    if (q.texts.length === 0) {
      console.log(q.id)
    }
  }) */
  return response.data
  // return quizzes
}

export const post = async quiz => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/quizzes",
    quiz,
    { headers: { "Content-Type": "application/json" } },
  )
  return response.data
}

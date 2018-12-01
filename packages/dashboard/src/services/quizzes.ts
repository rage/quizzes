import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"
import { quizzes } from "./mock"

export const getQuizzes = async course => {
  console.log(course)
  const response = await axios.get(
    `http://localhost:3000/api/v1/quizzes/?courseId=${course}`,
  )
  return response.data
  // return quizzes
}

export const post = async quiz => {
  console.log("POST", quiz)
}

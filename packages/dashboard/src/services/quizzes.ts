import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"
import { quizzes } from "./mock"

export const getQuizzes = async () => {
  // const response = await axios.get("http://localhost:3000/api/v1/quizzes/")
  // return response.data
  return quizzes
}

export const post = async quiz => {
  console.log("POST", quiz)
}

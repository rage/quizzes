import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"
import TMCApi from "../../../common/src/services/TMCApi"
import { quizzes } from "./mock"

export const getQuizzes = async course => {
  const user = TMCApi.checkStore()
  const response = await axios.get(
    `http://localhost:3000/api/v1/quizzes/?courseId=${course}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
    { headers: { authorization: `Bearer ${user.accessToken}` } },
  )
  return response.data
}

export const post = async quiz => {
  const user = TMCApi.checkStore()
  const response = await axios.post(
    "http://localhost:3000/api/v1/quizzes",
    quiz,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
  return response.data
}

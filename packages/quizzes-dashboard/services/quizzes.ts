import axios from "axios"
import { Quiz } from "../types/Quiz"
import { Course } from "../types/Course"

const api = axios.create({
  baseURL: "https://quizzes.mooc.fi/api/v1",
  headers: {
    Authorization:
      "Bearer c229c86b1cbe17a5aa14c2df0ba6d87b01865c1d2840944cc2a5c32201eae6e4",
  },
})

export const fetchCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses")
  return res.data
}

export const fetchCourseQuizzes = async (courseId: string): Promise<Quiz[]> => {
  const res = await api.get(
    `/quizzes/?courseId=${courseId}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
  )
  return res.data
}

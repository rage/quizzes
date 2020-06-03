import axios from "axios"
import { CourseListQuiz } from "../types/Quiz"
import { Course } from "../types/Course"
import { EditableQuiz } from "../types/EditQuiz"

const api = axios.create({
  //  baseURL: "https://quizzes.mooc.fi/api/v1",
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    Authorization:
      "Bearer c229c86b1cbe17a5aa14c2df0ba6d87b01865c1d2840944cc2a5c32201eae6e4",
  },
})

export const fetchCourses = async (): Promise<Course[]> => {
  return (await api.get("/courses")).data
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<CourseListQuiz[]> => {
  return (await api.get(
    `/quizzes/?courseId=${courseId}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
  )).data
}

export const fetchQuiz = async (id: string): Promise<EditableQuiz> => {
  return (await api.get(
    `/quizzes/${id}?course=true&items=true&options=true&peerreviews=true&stripped=false`,
  )).data.quiz
}

import axios from "axios"
import { CourseListQuiz } from "../types/Quiz"
import { Course } from "../types/Course"
import { EditableQuiz } from "../types/EditQuiz"

const apiV1 = axios.create({
  //  baseURL: "https://quizzes.mooc.fi/api/v1",
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    Authorization: "Bearer " + process.env.TOKEN,
  },
})

export const fetchCourses = async (): Promise<Course[]> => {
  return (await apiV1.get("/courses")).data
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<CourseListQuiz[]> => {
  return (
    await apiV1.get(
      `/quizzes/?courseId=${courseId}&course=true&items=true&options=true&peerreviews=true&stripped=false`,
    )
  ).data
}

export const fetchQuiz = async (id: string): Promise<EditableQuiz> => {
  return (
    await apiV1.get(
      `/quizzes/${id}?course=true&items=true&options=true&peerreviews=true&stripped=false`,
    )
  ).data.quiz
}

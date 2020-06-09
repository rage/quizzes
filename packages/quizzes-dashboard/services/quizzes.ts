import axios from "axios"
import { CourseListQuiz } from "../types/Quiz"
import { Course } from "../types/Course"
import { EditableQuiz } from "../types/EditQuiz"

const api = axios.create({
  baseURL: "http://localhost:6000/api/v2/dashboard",
  headers: {
    Authorization: "Bearer " + process.env.TOKEN,
  },
})

export const fetchCourses = async (): Promise<Course[]> => {
  return (await api.get("/courses")).data
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<CourseListQuiz[]> => {
  return (await api.get(`/courses/${courseId}/quizzes`)).data
}

export const fetchQuiz = async (id: string): Promise<EditableQuiz> => {
  return (await api.get(`/quizzes/${id}`)).data
}

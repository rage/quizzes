import axios from "axios"
import { CourseListQuiz } from "../types/Quiz"
import { Course } from "../types/Course"
import { EditableQuiz } from "../types/EditQuiz"

const HOST = process.env.HOST || "http://localhost:3003"

const api = axios.create({
  baseURL: `${HOST}/api/v2/dashboard`,
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

export const saveQuiz = async (quiz: EditableQuiz): Promise<any> => {
  const response = (await api.post(`quizzes`, { quiz })).data
  return response
}

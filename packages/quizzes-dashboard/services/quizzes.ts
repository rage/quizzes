import axios from "axios"
import { CourseListQuiz } from "../types/Quiz"
import { Course } from "../types/Course"
import { EditableQuiz } from "../types/EditQuiz"
import { checkStore } from "./tmcApi"

let HOST = "http://localhost:3003"

if (process.env.NODE_ENV === "production") {
  HOST = "https://quizzes2.mooc.fi"
}

const api = axios.create({
  baseURL: `${HOST}/api/v2/dashboard`,
})

export const fetchCourses = async (): Promise<Course[]> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const res = (await api.get("/courses", config)).data
    return res
  }
  return []
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<CourseListQuiz[]> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    return (await api.get(`/courses/${courseId}/quizzes`, config)).data
  }
  return []
}

export const fetchQuiz = async (id: string): Promise<EditableQuiz> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    return (await api.get(`/quizzes/${id}`, config)).data
  }
  throw new Error()
}

export const saveQuiz = async (quiz: EditableQuiz): Promise<any> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (await api.post(`quizzes`, quiz, config)).data
    return response
  }
}

import axios from "axios"
import { checkStore } from "./tmcApi"
import { Quiz, Course } from "../types/Quiz"
import { NewQuiz } from "../types/NormalizedQuiz"

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

export const fetchCourseById = async (id: string): Promise<Course> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    return (await api.get(`/courses/${id}`, config)).data
  }
  throw new Error()
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<{ course: Course; quizzes: Quiz[] }> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const quizzes = (await api.get(`/courses/${courseId}/quizzes`, config)).data
    const course = (await api.get(`/courses/${courseId}`, config)).data

    return { course: course, quizzes: quizzes }
  }
  throw new Error()
}

export const fetchQuiz = async (id: string): Promise<Quiz> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const data = (await api.get(`/quizzes/${id}`, config)).data
    return data
  }
  throw new Error()
}

export const saveQuiz = async (quiz: Quiz | NewQuiz): Promise<any> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (await api.post(`quizzes`, quiz, config)).data
    return response
  }
}

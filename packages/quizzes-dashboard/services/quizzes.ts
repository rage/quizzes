import axios from "axios"
import { checkStore } from "./tmcApi"
import { Quiz, Course } from "../types/Quiz"
import { NewQuiz } from "../types/NormalizedQuiz"
import { Answer } from "../types/Answer"

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

export const getAnswerById = async (answerId: string): Promise<Answer> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (await api.get(`/answers/${answerId}`, config)).data
    return response
  }
  throw new Error()
}

export const getAllAnswers = async (
  quizId: string,
  page: number,
  size: number,
): Promise<{ results: Answer[]; total: number }> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (
      await api.get(
        `/answers/${quizId}/all?page=${page - 1}&size=${size}`,
        config,
      )
    ).data
    return response
  }
  throw new Error()
}

export const getAnswersRequiringAttention = async (
  quizId: string,
  page: number,
  size: number,
): Promise<{ results: Answer[]; total: number }> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (
      await api.get(
        `/answers/${quizId}/manual-review?page=${page - 1}&size=${size}`,
        config,
      )
    ).data
    return response
  }
  throw new Error()
}

export const changeAnswerStatus = async (
  answerId: string,
  status: string,
): Promise<Answer> => {
  const userInfo = checkStore()
  if (userInfo) {
    const config = {
      headers: { Authorization: "bearer " + userInfo.accessToken },
    }
    const response = (
      await api.post(`/answers/${answerId}/status`, status, config)
    ).data
    return response
  }
  throw new Error()
}

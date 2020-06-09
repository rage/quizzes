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

const apiV2 = axios.create({
  baseURL: "http://localhost:6000/api/v2/dashboard",
  headers: {
    Authorization: "Bearer " + process.env.TOKEN,
  },
})

export const fetchCourses = async (): Promise<Course[]> => {
  return (await apiV2.get("/courses")).data
}

export const fetchCourseQuizzes = async (
  courseId: string,
): Promise<CourseListQuiz[]> => {
  return (await apiV2.get(`/courses/${courseId}/quizzes`)).data
}

export const fetchQuiz = async (id: string): Promise<EditableQuiz> => {
  return (await apiV2.get(`/quizzes/${id}`)).data
}

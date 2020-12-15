import useSWR from "swr"
import { fetchCourseById } from "./../services/quizzes"

const fetcher = (courseId: string) => fetchCourseById(courseId)

export const useCourse = (courseId: string, token: string) => {
  const { data, error } = useSWR([courseId, token], fetcher)
  return {
    course: data,
    courseLoading: !error && !data,
    courseError: error,
  }
}

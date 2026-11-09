import useSWR from "swr"

import { getUserAbilitiesForCourse } from "./../services/quizzes"

const fetcher = ([, courseId]: [string, string, string]) =>
  getUserAbilitiesForCourse(courseId)

export const useUserAbilities = (courseId: string, token: string) => {
  const { data, error } = useSWR(
    courseId ? ["userAbilities", courseId, token] : null,
    fetcher,
  )
  return {
    userAbilities: data,
    userAbilitiesLoading: !error && !data,
    userAbilitiesError: error,
  }
}

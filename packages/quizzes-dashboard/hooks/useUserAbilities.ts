import useSWR from "swr"
import { getUserAbilitiesForCourse } from "./../services/quizzes"

const fetcher = (courseId: string) => getUserAbilitiesForCourse(courseId)

export const useUserAbilities = (courseId: string, token: string) => {
  const { data, error } = useSWR([courseId, token], fetcher)
  return {
    userAbilities: data,
    userAbilitiesLoading: !error && !data,
    userAbilitiesError: error,
  }
}

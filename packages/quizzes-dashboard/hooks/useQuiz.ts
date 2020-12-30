import useSWR from "swr"
import { fetchQuiz } from "./../services/quizzes"

const fetcher = (quizId: string) => fetchQuiz(quizId)

export const useQuiz = (quizId: string, token: string) => {
  const { data, error } = useSWR([quizId, token], fetcher)
  return {
    quiz: data,
    quizLoading: !error && !data,
    quizError: error,
  }
}

import useSWR from "swr"
import { getAnswerById } from "./../services/quizzes"

const fetcher = (answerId: string) => getAnswerById(answerId)

export const useAnswer = (answerId: string | undefined, token: string) => {
  const { data, error, mutate } = useSWR(
    answerId ? [answerId, token] : null,
    fetcher,
  )

  return {
    answer: data,
    answerLoading: !error && data === undefined,
    answerError: error,
    mutate,
  }
}

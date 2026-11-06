import useSWR from "swr"
import { getAnswerById } from "./../services/quizzes"

const fetcher = ([, answerId]: [string, string, string]) =>
  getAnswerById(answerId)

export const useAnswer = (answerId: string | undefined, token: string) => {
  const { data, error, mutate } = useSWR(
    answerId ? ["answer", answerId, token] : null,
    fetcher,
  )

  return {
    answer: data,
    answerLoading: !error && data === undefined,
    answerError: error,
    mutate,
  }
}

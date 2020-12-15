import useSWR from "swr"
import { getAnswersRequiringAttentionByQuizId } from "./../services/quizzes"

const fetcher = (quizId: string) => getAnswersRequiringAttentionByQuizId(quizId)

export const useRequiringAttention = (quizId: string, token: string) => {
  const { data, error } = useSWR([quizId, token], fetcher)
  return {
    requiringAttention: data,
    requiringAttentionLoading: !error && data === undefined,
    requiringAttentionError: error,
  }
}

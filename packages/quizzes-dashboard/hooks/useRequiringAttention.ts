import useSWR from "swr"
import {
  getAnswersRequiringAttentionByQuizId,
  getAnswersRequiringAttention,
} from "./../services/quizzes"

const countFetcher = (quizId: string) =>
  getAnswersRequiringAttentionByQuizId(quizId)

export const useRequiringAttentionCount = (quizId: string, token: string) => {
  const { data, error } = useSWR([quizId, token], countFetcher)

  return {
    requiringAttention: data,
    requiringAttentionLoading: !error && data === undefined,
    requiringAttentionError: error,
  }
}

const answerFetcher = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
) =>
  getAnswersRequiringAttention(quizId, currentPage, answersDisplayed, sortOrder)

export const useRequiringAttention = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  token: string,
) => {
  const { data, error } = useSWR(
    [quizId, currentPage, answersDisplayed, sortOrder, token],
    answerFetcher,
  )

  return {
    requiringAttention: data,
    requiringAttentionLoading: !error && data === undefined,
    requiringAttentionError: error,
  }
}

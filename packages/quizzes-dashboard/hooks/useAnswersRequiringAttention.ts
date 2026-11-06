import useSWR from "swr"

import {
  getAnswersRequiringAttentionByQuizId,
  getAnswersRequiringAttention,
} from "../services/quizzes"

const countFetcher = ([, quizId]: [string, string, string]) =>
  getAnswersRequiringAttentionByQuizId(quizId)

export const useAnswersRequiringAttentionCount = (
  quizId: string,
  token: string,
) => {
  const { data, error } = useSWR(
    ["answersRequiringAttentionCount", quizId, token],
    countFetcher,
  )

  return {
    requiringAttention: data,
    requiringAttentionLoading: !error && data === undefined,
    requiringAttentionError: error,
  }
}

const answerFetcher = ([, quizId, currentPage, answersDisplayed, sortOrder]: [
  string,
  string,
  number,
  number,
  string,
  string,
]) =>
  getAnswersRequiringAttention(quizId, currentPage, answersDisplayed, sortOrder)

export const useRequiringAttention = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  token: string,
) => {
  const { data, error } = useSWR(
    [
      "answersRequiringAttention",
      quizId,
      currentPage,
      answersDisplayed,
      sortOrder,
      token,
    ],
    answerFetcher,
  )

  return {
    answersRequiringAttention: data,
    answersRequiringAttentionLoading: !error && data === undefined,
    answersRequiringAttentionError: error,
  }
}

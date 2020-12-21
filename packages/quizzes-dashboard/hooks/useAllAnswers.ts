import useSWR from "swr"
import { getAllAnswers } from "./../services/quizzes"

const fetcher = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
) =>
  getAllAnswers(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
    filterParameters,
  )

export const useAllAnswers = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
  token: string,
) => {
  const { data, error } = useSWR(
    [quizId, currentPage, answersDisplayed, sortOrder, filterParameters, token],
    fetcher,
  )

  return {
    allAnswers: data,
    allAnswersLoading: !error && data === undefined,
    allAnswersError: error,
  }
}

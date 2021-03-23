import useSWR from "swr"
import { boolean } from "yup/lib/locale"
import { getAllAnswers } from "./../services/quizzes"

const fetcher = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
  deleted: boolean,
  notDeleted: boolean,
) =>
  getAllAnswers(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
    filterParameters,
    deleted,
    notDeleted,
  )

export const useAllAnswers = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
  deleted: boolean,
  notDeleted: boolean,
  token: string,
) => {
  const { data, error } = useSWR(
    [
      quizId,
      currentPage,
      answersDisplayed,
      sortOrder,
      filterParameters,
      deleted,
      notDeleted,
      token,
    ],
    fetcher,
  )

  return {
    allAnswers: data,
    allAnswersLoading: !error && data === undefined,
    allAnswersError: error,
  }
}

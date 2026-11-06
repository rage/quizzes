import useSWR from "swr"
import { getAllAnswers } from "./../services/quizzes"

const fetcher = ([
  ,
  quizId,
  currentPage,
  answersDisplayed,
  sortOrder,
  filterParameters,
  deleted,
  notDeleted,
]: [
  string,
  string,
  number,
  number,
  string,
  string[],
  boolean,
  boolean,
  string,
]) =>
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
      "allAnswers",
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

import useSWR from "swr"
import {
  getAllAnswersMatchingQuery,
  getAnswersRequiringAttentionMatchingQuery,
} from "../services/quizzes"

const isEmpty = (str: string) => {
  return !str || 0 === str.length
}

const fetchAll = (
  quizId: string,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
  searchQuery: string,
) =>
  getAllAnswersMatchingQuery(
    quizId,
    answersDisplayed,
    sortOrder,
    filterParameters,
    searchQuery,
  )

const fetchRequiringAttention = (
  quizId: string,
  answersDisplayed: number,
  sortOrder: string,
  searchQuery: string,
) =>
  getAnswersRequiringAttentionMatchingQuery(
    quizId,
    answersDisplayed,
    sortOrder,
    searchQuery,
  )

export const useSearchResultsAllAnswers = (
  quizId: string,
  answersDisplayed: number,
  sortOrder: string,
  searchQuery: string,
  filterParameters: string[],
  deleted: boolean,
  notDeleted: boolean,
  token: string,
) => {
  const searchQueryProvided = !isEmpty(searchQuery)

  const { data, error } = useSWR(
    searchQuery
      ? [
          quizId,
          answersDisplayed,
          sortOrder,
          filterParameters,
          searchQuery,
          deleted,
          notDeleted,
          token,
        ]
      : null,
    fetchAll,
  )

  return {
    searchResults: data,
    searchResultsLoading: searchQueryProvided && !error && data === undefined,
    searchResultsError: error,
  }
}

export const useSearchResultsRequiringAttention = (
  quizId: string,
  answersDisplayed: number,
  sortOrder: string,
  searchQuery: string,
  token: string,
) => {
  const searchQueryProvided = !isEmpty(searchQuery)

  const { data, error } = useSWR(
    searchQuery
      ? [quizId, answersDisplayed, sortOrder, searchQuery, token]
      : null,
    fetchRequiringAttention,
  )

  return {
    searchResults: data,
    searchResultsLoading: searchQueryProvided && !error && data === undefined,
    searchResultsError: error,
  }
}

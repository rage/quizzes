import useSWR from "swr"
import { getAllAnswersMatchingQuery } from "../services/quizzes"

const isEmpty = (str: string) => {
  return !str || 0 === str.length
}

const fetcher = (
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

export const useSearchResults = (
  quizId: string,
  answersDisplayed: number,
  sortOrder: string,
  filterParameters: string[],
  searchQuery: string,
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
          token,
        ]
      : null,
    fetcher,
  )

  return {
    searchResults: data,
    searchResultsLoading: searchQueryProvided && !error && data === undefined,
    searchResultsError: error,
  }
}

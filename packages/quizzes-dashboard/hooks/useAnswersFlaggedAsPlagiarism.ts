import useSWR from "swr"
import {
  getAnswersFlaggedAsPlagiarismByQuizId,
  getAnswersRequiringAttention,
  getAnswersFlaggedAsPlagiarism,
} from "../services/quizzes"

const countFetcher = (quizId: string) =>
  getAnswersFlaggedAsPlagiarismByQuizId(quizId)

export const useAnswersFlaggedAsPlagiarismCount = (
  quizId: string,
  token: string,
) => {
  const { data, error } = useSWR([quizId, token], countFetcher)

  return {
    flaggedAsPlagiarism: data,
    flaggedAsPlagiarismLoading: !error && data === undefined,
    flaggedAsPlagiarismError: error,
  }
}

const answerFetcher = (
  quizId: string,
  currentPage: number,
  answersDisplayed: number,
  sortOrder: string,
) =>
  getAnswersFlaggedAsPlagiarism(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
  )

export const useFlaggedAsPlagiarism = (
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
    answersFlaggedAsPlagiarism: data,
    answersFlaggedAsPlagiarismLoading: !error && data === undefined,
    answersFlaggedAsPlagiarismError: error,
  }
}

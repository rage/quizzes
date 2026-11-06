import useSWR from "swr"

import { getQuizAnswerStatusChangeLog } from "./../services/quizzes"

const fetcher = ([, answerId]: [string, string, string]) =>
  getQuizAnswerStatusChangeLog(answerId)

export const useStatusChangeLogs = (
  answerId: string | undefined,
  token: string,
) => {
  const { data, error } = useSWR(
    answerId ? ["statusChangeLogs", answerId, token] : null,
    fetcher,
  )

  return {
    answerStatusChanges: data,
    answerStatusChangesLoading: !error && data === undefined,
    answerStatusChangesError: error,
  }
}

import { ActionType, getType } from "typesafe-actions"
import * as quizAnswerCounts from "./actions"

interface IQuizAnswerStatistic {
  quizId: string
  answerCount: number
}

export const answerCountsReducer = (
  state: IQuizAnswerStatistic[] = [],
  action: ActionType<typeof quizAnswerCounts>,
) => {
  switch (action.type) {
    case getType(quizAnswerCounts.set):
      return [...action.payload]
    case getType(quizAnswerCounts.clear):
      return []
    default:
      return state
  }
}

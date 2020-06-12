import { ActionType, getType } from "typesafe-actions"
import * as quizAnswerCounts from "./actions"

interface IQuizAnswerStatistic {
  quizId: string
  count: number
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
    case getType(quizAnswerCounts.decrement):
      const quizId = action.payload
      return state.map((ac) => {
        if (ac.quizId !== quizId) {
          return ac
        } else {
          return { ...ac, count: ac.count - 1 }
        }
      })
    default:
      return state
  }
}

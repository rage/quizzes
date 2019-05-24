import { ActionType, getType } from "typesafe-actions"
import * as quizAnswers from "./actions"

interface IQuizAnswerStatistic {
  quizId: string
  answerCount: number
}

export const answersReducer = (
  state: IQuizAnswerStatistic[] = [],
  action: ActionType<typeof quizAnswers>,
) => {
  switch (action.type) {
    case getType(quizAnswers.set):
      return [...action.payload]
    case getType(quizAnswers.clear):
      return []
    default:
      return state
  }
}

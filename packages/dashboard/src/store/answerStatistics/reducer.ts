import { ActionType, getType } from "typesafe-actions"
import * as answerStatistics from "./actions"

export const answerStatisticsReducer = (
  state: any[] = [],
  action: ActionType<typeof answerStatistics>,
) => {
  switch (action.type) {
    case getType(answerStatistics.set):
      return [...action.payload]
    case getType(answerStatistics.clear):
      return []
    default:
      return state
  }
}

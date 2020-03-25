import { ActionType, getType } from "typesafe-actions"
import * as quizAnswers from "./actions"

interface IAnswersState {
  data: any[] | null
  loading: boolean
}

const initialState = {
  data: null,
  loading: true,
}

export const answersReducer = (
  state: IAnswersState = initialState,
  action: ActionType<typeof quizAnswers>,
) => {
  switch (action.type) {
    case getType(quizAnswers.set):
      return { loading: false, data: [...action.payload] }
    case getType(quizAnswers.clear):
      return initialState
    case getType(quizAnswers.loadingStateChanged):
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

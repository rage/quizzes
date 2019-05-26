import { createAction } from "typesafe-actions"
import {
  getAttentionRequiringQuizAnswers,
  getQuizAnswers,
  getStatisticsForQuizAnswers,
} from "../../services/quizAnswers"

export const set = createAction("answerStatistics/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answerStatistics/CLEAR")

export const setAnswerStatistics = quizId => {
  return async (dispatch, getState) => {
    try {
      const data = await getStatisticsForQuizAnswers(quizId, getState().user)
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

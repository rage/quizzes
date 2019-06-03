import { createAction } from "typesafe-actions"
import {
  getAttentionRequiringQuizAnswers,
  getQuizAnswers,
} from "../../services/quizAnswers"

export const set = createAction("answers/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answers/CLEAR")

export const setAllAnswers = quizId => {
  return async (dispatch, getState) => {
    try {
      const data = await getQuizAnswers(quizId, getState().user)
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setAttentionRequiringAnswers = quizId => {
  return async (dispatch, getState) => {
    try {
      const data = await getAttentionRequiringQuizAnswers(
        quizId,
        getState().user,
      )
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

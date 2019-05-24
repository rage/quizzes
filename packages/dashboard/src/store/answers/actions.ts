import { createAction } from "typesafe-actions"
import { getOddAnswerCountsByQuizzes } from "../../services/quizzes"

export const set = createAction("answers/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answers/CLEAR")

export const setAnswers = () => {
  return async (dispatch, getState) => {
    try {
      const data = await getOddAnswerCountsByQuizzes(getState().user)
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

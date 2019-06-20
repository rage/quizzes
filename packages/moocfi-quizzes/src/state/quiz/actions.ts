import { createAction } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models"
import { getQuizInfo } from "../../services/quizService"

export const set = createAction("quiz/SET", resolve => {
  return (quiz: Quiz) => resolve(quiz)
})

export const clear = createAction("quiz/CLEAR")

export const setQuiz = (quizId: string) => async (dispatch, getState) => {
  const { languageId, accessToken } = getState().filter

  const { quiz } = await getQuizInfo(quizId, languageId, accessToken)

  await dispatch(set(quiz))
}

import { ActionCreator } from "redux"
import { ThunkAction } from "../store"
import { createAction } from "typesafe-actions"
import * as quizActions from "../quiz/actions"

export const set = createAction("language/SET", resolve => {
  return (languageId: string) => resolve(languageId)
})

export const clear = createAction("language/CLEAR")

export const initialize: ActionCreator<ThunkAction> = (
  courseId,
  languageId,
) => async (dispatch, getState) => {
  dispatch(set(languageId))
  const titles = await getQuizTitles(
    courseId,
    languageId,
    getState().backendAddress,
  )
  const title = titles[getState().quiz.id]
  dispatch(quizActions.setTitle(title))
}

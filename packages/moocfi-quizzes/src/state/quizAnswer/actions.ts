import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { QuizAnswerState } from "./reducer"
import { ThunkAction } from "../store"

export const set = createAction("quizAnswer/SET", resolve => {
  return (quizAnswer: QuizAnswerState) => resolve(quizAnswer)
})

export const clear = createAction("quizAnswer/CLEAR")

export const changeTextData = createAction(
  "quizAnswer/UPDATE_TEXT_VALUE",
  resolve => (itemId: string, newValue: string) =>
    resolve({ itemId, newValue }),
)

export const changeIntData = createAction(
  "quizAnswer/UPDATE_INT_VALUE",
  resolve => (itemId: string, newValue: number) =>
    resolve({ itemId, newValue }),
)

export const changeCheckboxData = createAction(
  "quizAnswer/TOGGLE_CHECKBOX_VALUE",
  resolve => (itemId: string, optionId: string) =>
    resolve({ itemId, optionId }),
)

export const chooseOption = createAction(
  "quizAnswer/CHOOSE_OPTION",
  resolve => (itemId: string, optionId: string, multi: boolean) =>
    resolve({ itemId, optionId, multi }),
)

export const changeChosenOption: ActionCreator<ThunkAction> = (
  itemId: string,
  optionId: string,
) => (dispatch, getState) => {
  const multi = getState().quiz.items.find(i => i.id === itemId).multi
  dispatch(chooseOption(itemId, optionId, multi))
}

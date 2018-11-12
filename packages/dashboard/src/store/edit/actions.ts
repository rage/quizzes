import _ from "lodash"
import { ActionType, createAction } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"

export const set = createAction("edit/SET", resolve => {
  return quiz => resolve(quiz)
})

export const newq = createAction("edit/NEW")

export const setEdit = (quiz: INewQuizQuery) => {
  return dispatch => {
    dispatch(set(quiz))
  }
}

export const newQuiz = () => {
  return dispatch => {
    dispatch(newq)
  }
}

export const changeAttr = (path, value) => {
  return (dispatch, getState) => {
    const quiz = Object.assign({}, getState().edit)
    _.set(quiz, path, value)
    console.log(quiz === getState().edit)
    dispatch(set(quiz))
  }
}

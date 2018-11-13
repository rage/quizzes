import _ from "lodash"
import { ActionType, createAction } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import { setFilter } from "../filter/actions"

export const set = createAction("edit/SET", resolve => {
  return quiz => resolve(quiz)
})

export const newq = createAction("edit/NEW")

export const setEdit = (quiz: any) => {
  return dispatch => {
    dispatch(set(quiz))
    dispatch(setFilter("language", quiz.course.languages[0].id))
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
    dispatch(set(quiz))
  }
}

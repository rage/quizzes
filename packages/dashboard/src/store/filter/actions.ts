import _ from "lodash"
import { createAction } from "typesafe-actions"
import { setQuizzes } from "../quizzes/actions"

export const set = createAction("filter/SET", resolve => {
  return filter => resolve(filter)
})

export const clear = createAction("filter/CLEAR")

export const setFilter = (path, value) => {
  return async (dispatch, getState) => {
    if (
      path === "course" &&
      !getState().quizzes.find(quiz => quiz.courseId === value)
    ) {
      dispatch(setQuizzes(value))
    }
    const filters = Object.assign({}, getState().filter)
    _.set(filters, path, value)
    console.log(filters)
    dispatch(set(filters))
  }
}

// export const setLanguage = () => {}

// export const setCourse  = () => {}

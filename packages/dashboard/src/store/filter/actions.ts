import _ from "lodash"
import { createAction } from "typesafe-actions"
import { setQuizzes } from "../quizzes/actions"

export const set = createAction("filter/SET", resolve => {
  return filter => resolve(filter)
})

export const clear = createAction("filter/CLEAR")

/*export const setFilter = (path, value) => {
  return async (dispatch, getState) => {
    if (path === "course" && !getState().quizzes.find(quiz => quiz.courseId === value)) {
      dispatch(setQuizzes(value))
    }
    const filters = Object.assign({}, getState().filter)
    _.set(filters, path, value)
    dispatch(set(filters))
  }
}*/

export const setLanguage = (language: string) => {
  return dispatch => {
    dispatch(set({ language }))
  }
}

export const setCourse = (course: string) => {
  return async (dispatch, getState) => {
    if (!getState().quizzes.find(quiz => quiz.courseId === course)) {
      await dispatch(setQuizzes(course))
    }
    const language = getState().courses.find(c => c.id === course).languages[0]
      .id
    dispatch(set({ course, language }))
  }
}

export const setQuiz = (quizId: string) => {
  return dispatch => {
    dispatch(set({ quiz: quizId }))
  }
}

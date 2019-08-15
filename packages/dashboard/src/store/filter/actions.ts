import _ from "lodash"
import { createAction } from "typesafe-actions"
import { setCourses } from "../courses/actions"
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
    console.log("Some is setting the lanuguage in the filter to", language)
    dispatch(set({ language }))
  }
}

export const setCourse = (course: string) => {
  return async (dispatch, getState) => {
    if (!getState().courses.some(c => c.id === course)) {
      await dispatch(setCourses())
    }
    const language = getState().courses.find(c => c.id === course).languages[0]
      .id
    dispatch(set({ course, language }))

    if (
      !getState().quizzes.find(
        courseQuizzesInfo => courseQuizzesInfo.courseId === course,
      )
    ) {
      await dispatch(setQuizzes(course))
    }
  }
}

export const setQuiz = (quizId: string) => {
  return dispatch => {
    dispatch(set({ quiz: quizId }))
  }
}

import _ from "lodash"
import { createAction } from "typesafe-actions"
import { IQuiz } from "../../interfaces"
import { setCourses } from "../courses/actions"
import { setQuizzes, setQuizzesByQuizId } from "../quizzes/actions"

export const set = createAction("filter/SET", resolve => {
  return filter => resolve(filter)
})

export const clear = createAction("filter/CLEAR")

/*export const setFilter = (path, value) => {
  return async (dispatch, getState) => {
    if (path === "course" && !getState().courseInfos().quizzes.find(quiz => quiz.courseId === value)) {
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
    if (!getState().courses.some(c => c.id === course)) {
      await dispatch(setCourses())
    }
    const language = getState().courses.find(c => c.id === course).languages[0]
      .id
    dispatch(set({ course, language }))

    if (
      !getState().quizzes.courseInfos.find(
        courseQuizzesInfo => courseQuizzesInfo.courseId === course,
      )
    ) {
      await dispatch(setQuizzes(course))
    }
  }
}

export const setQuiz = (quizId: string, setAlsoCourse: boolean = true) => {
  return async (dispatch, getState) => {
    const newState: any = { quiz: quizId }

    if (setAlsoCourse) {
      if (
        !getState().quizzes.courseInfos ||
        getState().quizzes.courseInfos.length === 0
      ) {
        await dispatch(setQuizzesByQuizId(quizId))
      }

      const courseInfo = getState().quizzes.courseInfos.find(courseQuizzes =>
        courseQuizzes.quizzes.some(quiz => quiz.id === quizId),
      )
      if (courseInfo) {
        newState.course = courseInfo.courseId
      }
    }

    dispatch(set(newState))
  }
}

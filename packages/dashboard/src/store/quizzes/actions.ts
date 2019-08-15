import { createAction } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models/quiz"
import { getQuiz, getQuizzes } from "../../services/quizzes"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"

export const set = createAction("quizzes/SET", resolve => {
  return (quizzes: ICourseQuizzes) => resolve(quizzes)
})

export const clear = createAction("quizzes/CLEAR")

export const remove = createAction("quizzes/REMOVE", resolve => {
  return (quizId: string) => resolve(quizId)
})

export const setQuizzes = (course: string) => {
  return async (dispatch, getState) => {
    try {
      const data = await getQuizzes(course, getState().user)
      dispatch(set({ courseId: course, quizzes: data }))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setQuizzesByQuizId = (quizId: string) => {
  return async (dispatch, getState) => {
    try {
      let data = await getQuiz(quizId)
      const courseId = data.courseId
      if (courseId) {
        data = await getQuizzes(courseId, getState().user)
        dispatch(set({ courseId, quizzes: data }))
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export interface ICourseQuizzes {
  courseId: string
  quizzes: any[]
}

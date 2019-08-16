import { createAction } from "typesafe-actions"
import { getQuiz, getQuizzes } from "../../services/quizzes"

export const set = createAction("quizzes/SET", resolve => {
  return (quizzes: ICourseQuizzes) => resolve(quizzes)
})

export const clear = createAction("quizzes/CLEAR")

export const startSetting = createAction(
  "quizzes/START_SETTING_COURSE",
  resolve => {
    return (courseId: string) => resolve(courseId)
  },
)

export const haveBeenSet = createAction(
  "quizzes/COURSE_QUIZZES_HAVE_BEEN_SET",
  resolve => {
    return (courseId: string) => resolve(courseId)
  },
)

export const remove = createAction("quizzes/REMOVE", resolve => {
  return (quizId: string) => resolve(quizId)
})

export const setQuizzes = (course: string) => {
  return async (dispatch, getState) => {
    try {
      if (getState().quizzes.currentlySetting.has(course)) {
        return
      }

      dispatch(startSetting(course))

      setTimeout(() => {
        if (getState().quizzes.currentlySetting.has(course)) {
          dispatch(haveBeenSet(course))
        }
      }, 5000)

      const data = await getQuizzes(course, getState().user)
      dispatch(set({ courseId: course, quizzes: data }))
      dispatch(haveBeenSet(course))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setQuizzesByQuizId = (quizId: string) => {
  return async (dispatch, getState) => {
    try {
      const data = await getQuiz(quizId)
      const courseId = data.courseId
      if (courseId) {
        dispatch(setQuizzes(courseId))
        /*
        data = await getQuizzes(courseId, getState().user)
        dispatch(set({ courseId, quizzes: data }))
        */
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

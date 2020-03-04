import { createAction } from "typesafe-actions"
import { IQuiz } from "../../interfaces"
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
      // surely this might be stored locally sometimes?
      const data = await getQuizFromStoreOrBackend(quizId, getState)
      const courseId = data.courseId
      if (courseId) {
        await dispatch(setQuizzes(courseId))
      }
    } catch (e) {
      console.log(e)
    }
  }
}

const getQuizFromStoreOrBackend = async (
  quizId: string,
  storeStateGetter: any,
): Promise<IQuiz> => {
  const courseQuizCollections = storeStateGetter().quizzes.courseInfos
  let quiz: IQuiz
  for (let i = 0; i < courseQuizCollections.legnth; i++) {
    quiz = courseQuizCollections[i].quizzes.find(q => q.id === quizId)
    if (quiz) {
      return quiz
    }
  }
  return await getQuiz(quizId)
}

export interface ICourseQuizzes {
  courseId: string
  quizzes: any[]
}

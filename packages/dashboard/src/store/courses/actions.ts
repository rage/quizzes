import { createAction } from "typesafe-actions"
import { ICourse } from "../../interfaces"
import { getCourses, duplicateCourse } from "../../services/courses"
import { setCourse } from "../filter/actions"

export const set = createAction("courses/SET", resolve => {
  return courses => resolve(courses)
})

export const add = createAction("courses/ADD", resolve => {
  return (course: ICourse) => resolve(course)
})

export const clear = createAction("courses/CLEAR")

export const createDuplicateCourse = (
  courseId: string,
  title: string,
  abbreviation: string,
) => {
  return async (dispatch, getState) => {
    try {
      const newCourse = await duplicateCourse(
        courseId,
        title,
        abbreviation,
        getState().user,
      )
      dispatch(add(newCourse))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setCourses = () => {
  return async (dispatch, getState) => {
    try {
      const courses = await getCourses(getState().user)
    } catch (error) {
      console.log(error)
    }
  }
}

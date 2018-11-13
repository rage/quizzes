import { createAction } from "typesafe-actions"
import { getCourses } from "../../services/courses"

export const set = createAction("courses/SET", resolve => {
  return courses => resolve(courses)
})

export const clear = createAction("courses/CLEAR")

export const setCourses = () => {
  return async dispatch => {
    try {
      const courses = await getCourses()
      dispatch(set(courses))
    } catch (error) {
      console.log(error)
    }
  }
}

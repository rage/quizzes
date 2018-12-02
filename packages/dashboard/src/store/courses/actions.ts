import { createAction } from "typesafe-actions"
import { getCourses } from "../../services/courses"
import { setCourse } from "../filter/actions"

export const set = createAction("courses/SET", resolve => {
  return courses => resolve(courses)
})

export const clear = createAction("courses/CLEAR")

export const setCourses = () => {
  return async dispatch => {
    try {
      const courses = await getCourses()
      const def = courses.find(
        course => course.id === "1c1d9c7d-5278-45d9-98a2-2dc72834df64",
      )
      if (def) {
        dispatch(setCourse(def.id))
      } else if (courses[0]) {
        dispatch(setCourse(courses[0].id))
      } else {
        dispatch(setCourse(""))
      }
      dispatch(set(courses))
    } catch (error) {
      console.log(error)
    }
  }
}

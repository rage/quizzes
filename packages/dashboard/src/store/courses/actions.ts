import { createAction } from "typesafe-actions"
import { getCourses } from "../../services/courses"
import { setCourse } from "../filter/actions"

export const set = createAction("courses/SET", resolve => {
  return courses => resolve(courses)
})

export const clear = createAction("courses/CLEAR")

export const setCourses = () => {
  return async (dispatch, getState) => {
    try {
      const courses = await getCourses(getState().user)

      if (getState().filter.course) {
        dispatch(setCourse(getState().filter.course))
      } else {
        /*
        const def = courses.find(
          course => course.id === "1c1d9c7d-5278-45d9-98a2-2dc72834df64",
        )
        if (def) {
          dispatch(setCourse(def.id))
        } else if (courses[0]) {
          dispatch(setCourse(courses[0].id))
        }
        */
        //  dispatch(set(courses))
      }
      if (getState().courses.length === 0) {
        dispatch(set(courses))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

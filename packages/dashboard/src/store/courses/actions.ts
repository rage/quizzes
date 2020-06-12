import { createAction } from "typesafe-actions"
import { createAndSaveSpaceSeparatedValueFile } from "../../components/tools"
import { ICourse } from "../../interfaces"
import { duplicateCourse, getCourses } from "../../services/courses"
import { setCourse } from "../filter/actions"
import { displayMessage } from "../notification/actions"

export const set = createAction("courses/SET", (resolve) => {
  return (courses) => resolve(courses)
})

export const add = createAction("courses/ADD", (resolve) => {
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
      const { newCourse, correspondanceData } = await duplicateCourse(
        courseId,
        title,
        abbreviation,
        getState().user,
      )
      dispatch(add(newCourse))
      createAndSaveSpaceSeparatedValueFile(
        correspondanceData,
        `quiz_ids_${courseId}_to_${newCourse.id}`,
      )
      dispatch(displayMessage(`The course ${title} was created!`, false))
    } catch (error) {
      console.log(error)
      dispatch(displayMessage(`Failed to create the course ${title}.`, true))
    }
  }
}

export const setCourses = () => {
  return async (dispatch, getState) => {
    try {
      const courses = await getCourses(getState().user)
      dispatch(set(courses))
    } catch (error) {
      console.log(error)
    }
  }
}

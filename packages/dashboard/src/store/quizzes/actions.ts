import { createAction } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models/quiz"
import { getQuizzes } from "../../services/quizzes"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"

export const set = createAction("quizzes/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("quizzes/CLEAR")

export const setQuizzes = () => {
  return async (dispatch, getState) => {
    try {
      const data = await getQuizzes()
      const cSet = new Set()
      data.map(quiz => cSet.add(quiz.course.id))
      const courses = data.filter(quiz => cSet.has(quiz.course.id))
      dispatch(
        set(
          data.sort((q1, q2) =>
            q1.texts[0].title.localeCompare(q2.texts[0].title),
          ),
        ),
      )
      dispatch(Filter.setFilter("course", courses[0].course.id))
    } catch (error) {
      console.log(error)
    }
  }
}

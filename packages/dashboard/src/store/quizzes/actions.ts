import { createAction } from "typesafe-actions"
import { getQuizzes } from '../../services/quizzes'
import * as Courses from '../courses/actions'

export const set = createAction("quizzes/SET", resolve => {
    return (quizzes: any) => resolve(quizzes)
})

export const clear = createAction('quizzes/CLEAR')

export const setQuizzes = () => {
    return async (dispatch) => {
        try {
            const data = await getQuizzes()
            const courses = new Set() 
            data.map(quiz => courses.add(quiz.courseId))
            dispatch(set(data))
            dispatch(Courses.set(Array.from(courses)))
        } catch (error) {
            console.log(error)
        }
    }
}



import { createAction } from "typesafe-actions"

export const set = createAction('courses/SET', resolve => {
    return (courses) => resolve(courses)
})
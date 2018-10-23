import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"
import * as Quizzes from "../quizzes/actions"

export const remove = createAction("user/REMOVE")

export const set = createAction("user/SET", resolve => {
  return (user: ITMCProfile) => resolve(user as ITMCProfile)
})

export const addUser = (user: ITMCProfile) => {
  return (dispatch: Dispatch<ActionType<typeof set | typeof remove>>) => {
    dispatch(set(user))
  }
}

export const removeUser = () => {
  return (dispatch: any) => {
    dispatch(remove())
    dispatch(Quizzes.clear())
    dispatch(Courses.clear())
    dispatch(Filter.clear())
  }
}

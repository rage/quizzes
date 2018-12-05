import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"
import * as Quizzes from "../quizzes/actions"

export const clear = createAction("user/CLEAR")

export const set = createAction("user/SET", resolve => {
  return (user: ITMCProfile) => resolve(user as ITMCProfile)
})

export const addUser = (user: ITMCProfile) => {
  return (dispatch: Dispatch<ActionType<typeof set | typeof clear>>) => {
    dispatch(set(user))
  }
}

export const removeUser = () => {
  return (dispatch: any) => {
    dispatch(clear())
    dispatch(Quizzes.clear())
    dispatch(Courses.clear())
    dispatch(Filter.clear())
  }
}

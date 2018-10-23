import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"

export const remove = createAction("user/REMOVE")

export const add = createAction("user/ADD", resolve => {
  return (user: ITMCProfile) => resolve(user as ITMCProfile)
})

export const addUser = (user: ITMCProfile) => {
  return (dispatch: Dispatch<ActionType<typeof add | typeof remove>>) => {
    dispatch(add(user))
  }
}

export const removeUser = () => {
  console.log("remove")
  return (dispatch: any) => {
    dispatch(remove())
  }
}

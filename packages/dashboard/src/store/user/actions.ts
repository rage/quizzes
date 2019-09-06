import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import { getOwnRoles } from "../../services/roles"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"
import * as Quizzes from "../quizzes/actions"
import { IUserState } from "./reducer"

export const clear = createAction("user/CLEAR")

export const set = createAction("user/SET", resolve => {
  return (newUserState: IUserState) => resolve(newUserState)
})

export const setRoles = createAction("user/SET_ROLES", resolve => {
  return ({ administrator, roles }) => resolve({ administrator, roles })
})

export const addUser = (user: ITMCProfile, isAdmin?: boolean) => async (
  dispatch,
  getState,
) => {
  let administrator = !!isAdmin
  if (administrator) {
    dispatch(
      set({
        username: user.username,
        accessToken: user.accessToken,
        administrator: true,
        roles: null,
      }),
    )
    return
  }
  const roles = await getOwnRoles(user.accessToken)
  let newRoles: null | any[] = null

  // if the parameter was not passed, but the user is still admin
  if (roles && roles.length === 1 && roles[0].role === "administrator") {
    administrator = true
  } else {
    newRoles = roles
  }

  const userInfo = {
    username: user.username,
    accessToken: user.accessToken,
    administrator,
    roles: newRoles,
  }
  dispatch(set(userInfo))
}

export const addRoles = () => async (dispatch, getState) => {
  const roles = await getOwnRoles(getState().user.accessToken)
  let administrator = false
  let newRoles: null | any[] = null

  if (roles && roles.length === 1 && roles[0].role === "administrator") {
    administrator = true
  } else {
    newRoles = roles
  }

  dispatch(
    setRoles({
      administrator,
      roles: newRoles,
    }),
  )
}

export const removeUser = () => {
  return (dispatch: any) => {
    dispatch(clear())
    dispatch(Quizzes.clear())
    dispatch(Courses.clear())
    dispatch(Filter.clear())
  }
}

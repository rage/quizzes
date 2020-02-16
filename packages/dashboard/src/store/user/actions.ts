import { Dispatch } from "redux"
import { ActionType, createAction } from "typesafe-actions"
import { ITMCProfile } from "../../../../common/src/types"
import { getOwnRoles } from "../../services/roles"
import * as AnswerCounts from "../answerCounts/actions"
import * as Courses from "../courses/actions"
import * as Filter from "../filter/actions"
import * as Notification from "../notification/actions"
import * as Quizzes from "../quizzes/actions"
import { InitializationStatus, IUserState } from "./reducer"

export const clear = createAction("user/CLEAR")

export const setInitializationStatus = createAction(
  "user/SET_INITIALIZATION_STATUS",
  resolve => (newStatus: InitializationStatus) => resolve(newStatus),
)

export const set = createAction("user/SET", resolve => {
  return (newUserState: {
    username: string
    accessToken: string
    administrator: boolean
    roles: null | any[]
  }) => resolve(newUserState)
})

export const setRoles = createAction("user/SET_ROLES", resolve => {
  return ({ administrator, roles }) => resolve({ administrator, roles })
})

export const addUser = (
  user: ITMCProfile,
  isAdmin?: boolean,
  loginFormCompleted?: boolean,
) => async (dispatch, getState) => {
  dispatch(setInitializationStatus(InitializationStatus.INITIALIZING))

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
  } else {
    const roles = await getOwnRoles(user.accessToken)

    if (!roles || roles.length === 0) {
      if (loginFormCompleted) {
        dispatch(
          Notification.displayMessage(
            `You don't have sufficient permissions.`,
            true,
          ),
        )
      }

      return
    }

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
  if (loginFormCompleted) {
    dispatch(Notification.displayMessage(`Welcome, ${user.username}!`, false))
  }
  dispatch(Courses.setCourses())
  dispatch(AnswerCounts.setAnswerCounts())
}

export const addRoles = () => async (dispatch, getState) => {
  const roles = await getOwnRoles(getState().user.accessToken)
  let administrator = false
  let newRoles: null | any[] = null

  console.log("ROles: ", roles)
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

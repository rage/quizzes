import { createAction } from "typesafe-actions"

export const set = createAction("filter/SET", resolve => {
  return filter => resolve(filter)
})

export const clear = createAction("filter/CLEAR")

export const setFilter = filter => {
  return dispatch => {
    dispatch(set(filter))
  }
}

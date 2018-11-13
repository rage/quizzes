import _ from "lodash"
import { createAction } from "typesafe-actions"

export const set = createAction("filter/SET", resolve => {
  return filter => resolve(filter)
})

export const clear = createAction("filter/CLEAR")

export const setFilter = (path, value) => {
  return (dispatch, getState) => {
    const filters = Object.assign({}, getState().filter)
    _.set(filters, path, value)
    dispatch(set(filters))
  }
}

import { getType } from "typesafe-actions"
import * as filter from "./actions"

export interface IFilterState {
  course: string
  language: string
  quiz: string
}

const initialState = {
  course: "",
  language: "",
  quiz: "",
}

export const filterReducer = (
  state: IFilterState = initialState,
  action: any,
): IFilterState => {
  switch (action.type) {
    case getType(filter.set):
      return Object.assign({}, state, action.payload)
    case getType(filter.clear):
      return initialState
    default:
      return state
  }
}

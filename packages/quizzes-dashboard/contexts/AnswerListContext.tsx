import React, { useReducer } from "react"
import { Answer } from "../types/Answer"

interface IAnswerListState {
  answers: Answer[]
  bulkSelectedIds: string[]
  bulkSelectMode: boolean
  enableSearch: boolean
  expandAll: boolean
}

const initialState: IAnswerListState = {
  answers: [],
  bulkSelectedIds: [],
  bulkSelectMode: false,
  enableSearch: false,
  expandAll: false,
}

enum AnswerListTypes {
  TOGGLE_ENABLE_SEARCH = "TOGGLE_ENABLE_SEARCH",
  TOGGLE_EXPAND_ALL = "TOGGLE_EXPAND_ALL",
  TOGGLE_BULK_SELECT_MODE = "TOGGLE_BULK_SELECT_MODE",
  SET_ANSWERS = "SET_ANSWERS",
  SET_BULK_SELECTED_IDS = "SET_BULK_SELECTED_IDS",
}

type AnswerListActionTypes =
  | { type: AnswerListTypes.TOGGLE_ENABLE_SEARCH }
  | { type: AnswerListTypes.TOGGLE_EXPAND_ALL }
  | { type: AnswerListTypes.TOGGLE_BULK_SELECT_MODE }
  | { type: AnswerListTypes.SET_ANSWERS; answers: Answer[] }
  | { type: AnswerListTypes.SET_BULK_SELECTED_IDS; ids: string[] }

let reducer = (
  state: IAnswerListState,
  action: AnswerListActionTypes,
): IAnswerListState => {
  switch (action.type) {
    case AnswerListTypes.TOGGLE_ENABLE_SEARCH:
      return { ...state, enableSearch: !state.enableSearch }
    default:
      throw new Error()
  }
}

export const setEnableSearch = () => ({
  type: AnswerListTypes.TOGGLE_ENABLE_SEARCH,
})

const AnswerListContext = React.createContext(initialState)

function AnswerListProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  // TODO: figure out how to type value
  const value: any = { state, dispatch }
  return (
    <AnswerListContext.Provider value={value}>
      {children}
    </AnswerListContext.Provider>
  )
}
export { AnswerListContext, AnswerListProvider }

import React, { useReducer, Dispatch } from "react"

interface IAnswerListState {
  bulkSelectedIds: string[]
  bulkSelectMode: boolean
  enableSearch: boolean
  expandAll: boolean
}

const initialState: IAnswerListState = {
  bulkSelectedIds: [],
  bulkSelectMode: false,
  enableSearch: false,
  expandAll: false,
}

enum AnswerListTypes {
  TOGGLE_ENABLE_SEARCH = "TOGGLE_ENABLE_SEARCH",
}

type AnswerListActionTypes = { type: AnswerListTypes.TOGGLE_ENABLE_SEARCH }

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

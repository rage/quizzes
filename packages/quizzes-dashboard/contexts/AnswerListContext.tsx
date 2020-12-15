import React, { useContext, useReducer } from "react"
import { Answer } from "../types/Answer"

interface IAnswerListState {
  answers: Answer[]
  bulkSelectedIds: string[]
  updatedAnswersIds: string[]
  bulkSelectMode: boolean
  enableSearch: boolean
  expandAll: boolean
  statusUpdateType: string
}

const initialState: IAnswerListState = {
  answers: [],
  bulkSelectedIds: [],
  updatedAnswersIds: [],
  statusUpdateType: "",
  bulkSelectMode: false,
  enableSearch: false,
  expandAll: false,
}

enum AnswerListTypes {
  TOGGLE_ENABLE_SEARCH = "TOGGLE_ENABLE_SEARCH",
  SET_EXPAND_ALL = "SET_EXPAND_ALL",
  TOGGLE_BULK_SELECT_MODE = "TOGGLE_BULK_SELECT_MODE",
  SET_ANSWERS = "SET_ANSWERS",
  SET_BULK_SELECTED_IDS = "SET_BULK_SELECTED_IDS",
  SET_UPDATED_ANSWERS_IDS = "SET_UPDATED_ANSWERS_IDS",
  SET_STATUS_UPDATE_TYPE = "SET_STATUS_UPDATE_TYPE",
}

type AnswerListActionTypes =
  | { type: AnswerListTypes.SET_EXPAND_ALL; payload: boolean }
  | { type: AnswerListTypes.SET_BULK_SELECTED_IDS; payload: string[] }
  | { type: AnswerListTypes.SET_UPDATED_ANSWERS_IDS; payload: string[] }
  | { type: AnswerListTypes.TOGGLE_BULK_SELECT_MODE }
  | {
      type: AnswerListTypes.SET_STATUS_UPDATE_TYPE
      payload: string
    }

let reducer = (
  state: IAnswerListState,
  action: AnswerListActionTypes,
): IAnswerListState => {
  switch (action.type) {
    case AnswerListTypes.SET_BULK_SELECTED_IDS:
      return { ...state, bulkSelectedIds: [...action.payload] }
    case AnswerListTypes.TOGGLE_BULK_SELECT_MODE:
      return { ...state, bulkSelectMode: !state.bulkSelectMode }
    case AnswerListTypes.SET_UPDATED_ANSWERS_IDS:
      return { ...state, updatedAnswersIds: [...action.payload] }
    case AnswerListTypes.SET_STATUS_UPDATE_TYPE:
      return { ...state, statusUpdateType: action.payload }
    case AnswerListTypes.SET_EXPAND_ALL:
      return { ...state, expandAll: action.payload }
    default:
      throw new Error()
  }
}

export const setBulkSelectedIds = (ids: string[]): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_BULK_SELECTED_IDS,
    payload: ids,
  }
}

export const setUpdatedAnswersIds = (ids: string[]): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_UPDATED_ANSWERS_IDS,
    payload: ids,
  }
}

export const toggleBulkSelectMode = (): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.TOGGLE_BULK_SELECT_MODE,
  }
}

export const setExpandAll = (value: boolean): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_EXPAND_ALL,
    payload: value,
  }
}

export const setEnableSearch = () => ({
  type: AnswerListTypes.TOGGLE_ENABLE_SEARCH,
})

export const setStatusUpdateType = (type: string): AnswerListActionTypes => ({
  type: AnswerListTypes.SET_STATUS_UPDATE_TYPE,
  payload: type,
})

const AnswerListContext = React.createContext<
  [IAnswerListState, React.Dispatch<AnswerListActionTypes>]
>([initialState, () => initialState])

export const AnswerListProvider = ({
  children,
}: {
  children: React.ReactElement
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AnswerListContext.Provider value={[state, dispatch]}>
      {children}
    </AnswerListContext.Provider>
  )
}

export const useAnswerListState = () => useContext(AnswerListContext)

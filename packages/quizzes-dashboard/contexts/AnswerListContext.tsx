import React, { useContext, useReducer } from "react"
import { Answer } from "../types/Answer"

interface IAnswerListState {
  allAnswers: { results: Answer[]; total: number }
  answersRequiringAttention: { results: Answer[]; total: number }
  bulkSelectedIds: string[]
  updatedAnswersIds: string[]
  handledAnswers: Answer[]
  bulkSelectMode: boolean
  enableSearch: boolean
  expandAll: boolean
  statusUpdateType: string
}

const initialState: IAnswerListState = {
  allAnswers: { results: [], total: 0 },
  answersRequiringAttention: { results: [], total: 0 },
  bulkSelectedIds: [],
  updatedAnswersIds: [],
  handledAnswers: [],
  statusUpdateType: "",
  bulkSelectMode: false,
  enableSearch: false,
  expandAll: false,
}

enum AnswerListTypes {
  TOGGLE_ENABLE_SEARCH = "TOGGLE_ENABLE_SEARCH",
  TOGGLE_BULK_SELECT_MODE = "TOGGLE_BULK_SELECT_MODE",
  SET_EXPAND_ALL = "SET_EXPAND_ALL",
  SET_ALL_ANSWERS = "SET_ALL_ANSWERS",
  SET_ANSWERS_REQUIRING_ATTENTION = "SET_ANSWERS_REQUIRING_ATTENTION",
  SET_BULK_SELECTED_IDS = "SET_BULK_SELECTED_IDS",
  SET_UPDATED_ANSWERS_IDS = "SET_UPDATED_ANSWERS_IDS",
  SET_HANDLED_ANSWERS = "SET_HANDLED_ANSWERS",
  SET_STATUS_UPDATE_TYPE = "SET_STATUS_UPDATE_TYPE",
}

type AnswerType = { results: Answer[]; total: number }

type AnswerListActionTypes =
  | { type: AnswerListTypes.SET_ALL_ANSWERS; payload: AnswerType }
  | {
      type: AnswerListTypes.SET_ANSWERS_REQUIRING_ATTENTION
      payload: AnswerType
    }
  | { type: AnswerListTypes.SET_EXPAND_ALL; payload: boolean }
  | { type: AnswerListTypes.SET_BULK_SELECTED_IDS; payload: string[] }
  | { type: AnswerListTypes.SET_UPDATED_ANSWERS_IDS; payload: string[] }
  | { type: AnswerListTypes.SET_HANDLED_ANSWERS; payload: Answer[] }
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
    case AnswerListTypes.SET_ALL_ANSWERS:
      // return { ...state, allAnswers: [...action.payload] }
      return { ...state, allAnswers: { ...action.payload } }
    case AnswerListTypes.SET_ANSWERS_REQUIRING_ATTENTION:
      return { ...state, answersRequiringAttention: { ...action.payload } }
    case AnswerListTypes.SET_BULK_SELECTED_IDS:
      return { ...state, bulkSelectedIds: [...action.payload] }
    case AnswerListTypes.TOGGLE_BULK_SELECT_MODE:
      return { ...state, bulkSelectMode: !state.bulkSelectMode }
    case AnswerListTypes.SET_UPDATED_ANSWERS_IDS:
      return { ...state, updatedAnswersIds: [...action.payload] }
    case AnswerListTypes.SET_HANDLED_ANSWERS:
      return { ...state, handledAnswers: [...action.payload] }
    case AnswerListTypes.SET_STATUS_UPDATE_TYPE:
      return { ...state, statusUpdateType: action.payload }
    case AnswerListTypes.SET_EXPAND_ALL:
      return { ...state, expandAll: action.payload }
    default:
      throw new Error()
  }
}

export const setAllAnswers = (answers: AnswerType): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_ALL_ANSWERS,
    payload: answers,
  }
}

export const setRequiringAttention = (
  answers: AnswerType,
): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_ANSWERS_REQUIRING_ATTENTION,
    payload: answers,
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

export const setHandledAnswers = (answers: Answer[]): AnswerListActionTypes => {
  return {
    type: AnswerListTypes.SET_HANDLED_ANSWERS,
    payload: answers,
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

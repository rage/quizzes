import { createReducer } from 'typesafe-actions'
import { ActionType } from '..'
import { initializeQuiz } from './globalActions'
import produce from 'immer'

const initialState = {
  quizId: null
}

interface GlobalType {
  quizId: string | null
}

const globalReducers = createReducer<GlobalType, ActionType>(
  initialState
).handleAction(initializeQuiz, (state, action) => {
  return produce(state, (draftState) => {
    draftState.quizId = action.payload.quizId
  })
})

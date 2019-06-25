import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import { languageReducer, LanguageState } from "./language/reducer"
import { messageReducer } from "./message/reducer"
import { peerReviewsReducer } from "./peerReviews/reducer"
import { quizReducer } from "./quiz/reducer"
import { quizAnswerReducer } from "./quizAnswer/reducer"
import { submitLockedReducer } from "./submitLocked/reducer"
import { userReducer } from "./user/reducer"
import { userQuizStateReducer } from "./userQuizState/reducer"
import * as PeereviewsActions from "./peerReviews/actions"

const rootReducer = combineReducers({
  language: languageReducer,
  message: messageReducer,
  peerReviews: peerReviewsReducer,
  quiz: quizReducer,
  quizAnswer: quizAnswerReducer,
  submitLocked: submitLockedReducer,
  user: userReducer,
  userQuizState: userQuizStateReducer,
})

const rootAction = {
  peerReviews: PeereviewsActions,
}

export interface State {
  language: LanguageState
}

import { StateType, ActionType } from "typesafe-actions"

export type Store = StateType<typeof createStoreInstance>
export type RootState = StateType<typeof rootReducer>
export type Dispatch = (action: RootAction) => void

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type RootAction =
  | ActionType<typeof rootAction>
  | ThunkAction
  | Promise<any>
export type GetState = () => State

const createStoreInstance = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}

export default createStoreInstance

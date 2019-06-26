import { useSelector, TypedUseSelectorHook } from "react-redux"
import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import { languageReducer, LanguageState } from "./language/reducer"
import { messageReducer } from "./message/reducer"
import { peerReviewsReducer, PeerReviewsState } from "./peerReviews/reducer"
import { quizReducer, QuizState } from "./quiz/reducer"
import { quizAnswerReducer, QuizAnswerState } from "./quizAnswer/reducer"
import { submitLockedReducer } from "./submitLocked/reducer"
import { userReducer, UserState } from "./user/reducer"

import * as languageActions from "./language/actions"
import * as messageActions from "./message/actions"
import * as quizActions from "./quiz/actions"
import * as quizAnswerActions from "./quizAnswer/actions"
import * as submitLockedActions from "./submitLocked/actions"
import * as userActions from "./user/actions"
import * as PeerReviewsActions from "./peerReviews/actions"

const rootReducer = combineReducers({
  language: languageReducer,
  message: messageReducer,
  peerReviews: peerReviewsReducer,
  quiz: quizReducer,
  quizAnswer: quizAnswerReducer,
  submitLocked: submitLockedReducer,
  user: userReducer,
})

const rootAction = {
  language: languageActions,
  peerReviews: PeerReviewsActions,
  message: messageActions,
  quiz: quizActions,
  quizAnswer: quizAnswerActions,
  submitLocked: submitLockedActions,
  user: userActions,
}

export interface State {
  language: LanguageState
  peerReviews: PeerReviewsState
  message: string
  quiz: QuizState
  quizAnswer: QuizAnswerState
  submitLocked: boolean
  user: UserState
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

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default createStoreInstance

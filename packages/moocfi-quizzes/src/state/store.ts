import { useSelector, TypedUseSelectorHook } from "react-redux"
import { applyMiddleware, combineReducers, createStore } from "redux"
import { StateType, ActionType, getType } from "typesafe-actions"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"

import {
  backendAddressReducer,
  initialState as backendAddressInitialState,
} from "./backendAddress/reducer"
import {
  customizationReducer,
  ICustomizationState,
  initialState as customizationInitialState,
} from "./customization/reducer"
import {
  feedbackDisplayedReducer,
  initialState as feedbackDisplayedInitialState,
} from "./feedbackDisplayed/reducer"
import {
  languageReducer,
  LanguageState,
  initialState as languageInitialState,
} from "./language/reducer"
import {
  loadingBarsReducer,
  initialState as loadingBarsInitialState,
} from "./loadingBars/reducer"
import {
  messageReducer,
  MessageState,
  initialState as messageInitialState,
} from "./message/reducer"
import {
  peerReviewsReducer,
  PeerReviewsState,
  initialState as peerReviewsInitialState,
} from "./peerReviews/reducer"
import {
  quizReducer,
  QuizState,
  initialState as quizInitialState,
} from "./quiz/reducer"
import {
  quizAnswerReducer,
  QuizAnswerState,
  initialState as quizAnswerInitialState,
} from "./quizAnswer/reducer"
import {
  userReducer,
  UserState,
  initialState as userInitialState,
} from "./user/reducer"
import {
  receivedReviewsReducer,
  IReceivedReviewsState,
  initialState as receivedReviewsInitialState,
} from "./receivedReviews/reducer"

import * as rootActions from "./actions"
import * as backendAddressActions from "./backendAddress/actions"
import * as customizationActions from "./customization/actions"
import * as feedbackDisplayedActions from "./feedbackDisplayed/actions"
import * as languageActions from "./language/actions"
import * as loadingBarsActions from "./loadingBars/actions"
import * as messageActions from "./message/actions"
import * as quizActions from "./quiz/actions"
import * as quizAnswerActions from "./quizAnswer/actions"
import * as userActions from "./user/actions"
import * as PeerReviewsActions from "./peerReviews/actions"
import * as receivedReviewsActions from "./receivedReviews/actions"

const initialState: State = {
  backendAddress: backendAddressInitialState,
  customization: customizationInitialState,
  feedbackDisplayed: feedbackDisplayedInitialState,
  language: languageInitialState,
  loadingBars: loadingBarsInitialState,
  peerReviews: peerReviewsInitialState,
  message: messageInitialState,
  quiz: quizInitialState,
  quizAnswer: quizAnswerInitialState,
  user: userInitialState,
  receivedReviews: receivedReviewsInitialState,
}

const reducer = (
  state: State = initialState,
  action: ActionType<typeof rootActions>,
) => {
  if (getType(rootActions.clearActionCreator)) {
    return initialState
  }
  return state
}

const rootReducer = combineReducers({
  root: reducer,
  backendAddress: backendAddressReducer,
  customization: customizationReducer,
  feedbackDisplayed: feedbackDisplayedReducer,
  language: languageReducer,
  loadingBars: loadingBarsReducer,
  message: messageReducer,
  peerReviews: peerReviewsReducer,
  quiz: quizReducer,
  quizAnswer: quizAnswerReducer,
  receivedReviews: receivedReviewsReducer,
  user: userReducer,
})

/*const rootReducerD: typeof rootReducerImpl = (state, action) => {
  if (action.type === "CLEAR") {
    // @ts-ignore
    const bestState: State = undefined

    return bestState
  }
  return rootReducerImpl(state, action)
}*/

export const rootAction = {
  rootAction: rootActions,
  backendAction: backendAddressActions,
  customization: customizationActions,
  feedbackDisplayed: feedbackDisplayedActions,
  language: languageActions,
  loadingBars: loadingBarsActions,
  peerReviews: PeerReviewsActions,
  message: messageActions,
  quiz: quizActions,
  quizAnswer: quizAnswerActions,
  user: userActions,
  receivedReviews: receivedReviewsActions,
}

export interface State {
  backendAddress: string
  customization: ICustomizationState
  feedbackDisplayed: boolean
  language: LanguageState
  loadingBars: boolean
  peerReviews: PeerReviewsState
  message: MessageState
  quiz: QuizState
  quizAnswer: QuizAnswerState
  user: UserState
  receivedReviews: IReceivedReviewsState
}

export type Store = StateType<typeof createStoreCreator>
export type RootState = StateType<typeof rootReducer>
export type Dispatch = (action: RootAction) => void

type ClearActionType = {
  type: string
}

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type RootAction =
  | ActionType<typeof rootAction>
  | ThunkAction
  | Promise<any>
  | ClearActionType

export type GetState = () => State

const idToStoreCache: Map<string, Store> = new Map()

const createStoreInstance = (id: string): Store => {
  const cached = idToStoreCache.get(id)
  if (cached) {
    return cached
  }
  const store = createStoreCreator()
  idToStoreCache.set(id, store)
  return store
}

const createStoreCreator = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default createStoreInstance

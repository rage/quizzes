import {
  createStore,
  combineReducers,
  applyMiddleware,
  Action,
  Store,
  Reducer
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkAction } from 'redux-thunk'
import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook
} from 'react-redux'
import QuizzesApi from '../services/quizzes'
import { createContext } from 'react'

export interface RootState {
  quizId: string
}

const createRootReducer = (quizId: string): Reducer => {
  const intialState: RootState = {
    quizId
  }
  const rootReducer = (state: RootState = intialState, action: any) => {}
  return rootReducer
}

// export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

// Export your custom hooks if you wish to use them in other files.
export const useStore = createStoreHook<RootState>()
export const useDispatch = createDispatchHook<RootState>()
export const useSelector = createSelectorHook<RootState>()

interface CreateStoreProps {
  id: string
}

export interface ActionType {
  type: string
  payload?: any
  meta?: any
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// Store depends on quiz id and on access token to make sure we create a
// new store whenever one of these change.
const storeCreator = (quizId: string, accessToken: string | null): Store => {
  const quizzesApi = new QuizzesApi(accessToken)
  const rootReducer = createRootReducer(quizId)
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(quizzesApi)))
  )
  return store
}

export default storeCreator

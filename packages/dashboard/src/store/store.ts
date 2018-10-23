import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { userReducer } from "./user/reducer"

const reducer = combineReducers({ user: userReducer })

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
)

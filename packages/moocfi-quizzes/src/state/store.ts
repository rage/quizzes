import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import rootReducer from "./rootReducer"
import { languageReducer } from "./language/reducer"
import { peerReviewReducer } from "./peerReview/reducer"
import { quizReducer } from "./quiz/reducer"
import { userReducer } from "./user/reducer"

const reducer = combineReducers({
  language: languageReducer,
  peerReview: peerReviewReducer,
  quiz: quizReducer,
  root: rootReducer,
  user: userReducer,
})

const createStoreInstance = () => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
}

export default createStoreInstance

import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import { languageReducer } from "./language/reducer"
import { messageReducer } from "./message/reducer"
import { peerReviewReducer } from "./peerReview/reducer"
import { quizReducer } from "./quiz/reducer"
import { quizAnswerReducer } from "./quizAnswer/reducer"
import { submitLockedReducer } from "./submitLocked/reducer"
import { userReducer } from "./user/reducer"
import { userQuizStateReducer } from "./userQuizState/reducer"

const reducer = combineReducers({
  language: languageReducer,
  message: messageReducer,
  peerReview: peerReviewReducer,
  quiz: quizReducer,
  quizAnswer: quizAnswerReducer,
  submitLocked: submitLockedReducer,
  user: userReducer,
  userQuizState: userQuizStateReducer,
})

const createStoreInstance = () => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
}

export default createStoreInstance

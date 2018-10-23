import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { coursesReducer } from "./courses/reducer"
import { filterReducer } from "./filter/reducer"
import { quizzesReducer } from "./quizzes/reducer"
import { userReducer } from "./user/reducer"

const reducer = combineReducers({
  courses: coursesReducer,
  filter: filterReducer,
  user: userReducer,
  quizzes: quizzesReducer,
})

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
)

import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"
import { coursesReducer } from "./courses/reducer"
import { editReducer } from "./edit/reducer"
import { filterReducer } from "./filter/reducer"
import { quizzesReducer } from "./quizzes/reducer"
import { userReducer } from "./user/reducer"

const reducer = combineReducers({
  courses: coursesReducer,
  edit: editReducer,
  filter: filterReducer,
  user: userReducer,
  quizzes: quizzesReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filter"],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)),
)

export const persistor = persistStore(store)

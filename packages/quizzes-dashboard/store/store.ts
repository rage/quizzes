import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import userReducer, { UserState } from "./user/userReducer"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { optionReducer } from "./editor/options/optionReducer"
import { itemReducer } from "./editor/items/itemReducer"
import { quizReducer } from "./editor/quiz/quizReducer"
import { resultReducer } from "./editor/result/resultReducer"
import { Quiz, Item, Option } from "../types/NormalizedQuiz"

//const reducer = combineReducers({ editor: editReducer2, user: userReducer })

const editorReducer = combineReducers({
  quizzes: quizReducer,
  items: itemReducer,
  options: optionReducer,
  quizId: resultReducer,
})

const reducer = combineReducers({
  editor: editorReducer,
  user: userReducer,
})

const store = createStore(reducer, composeWithDevTools())

interface storeState {
  editor: {
    quizzes: { [quizId: string]: Quiz }
    items: { [itemId: string]: Item }
    options: { [optionId: string]: Option }
    quizId: string
  }
  user: UserState
}

export const useTypedSelector: TypedUseSelectorHook<storeState> = useSelector

export default store

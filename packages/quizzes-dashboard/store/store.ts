import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { optionReducer } from "./editor/options/optionReducer"
import { itemReducer } from "./editor/items/itemReducer"
import { quizReducer } from "./editor/quiz/quizReducer"
import { resultReducer } from "./editor/result/resultReducer"
import {
  Quiz,
  Item,
  Option,
  ItemVariables,
  OptionVariables,
} from "../types/NormalizedQuiz"
import { itemVariableReducers } from "./editor/itemVariables/itemVariableReducers"
import { optionVariableReducers } from "./editor/optionVariables/optionVariableReducers"

//const reducer = combineReducers({ editor: editReducer2, user: userReducer })

const editorReducer = combineReducers({
  quizzes: quizReducer,
  items: itemReducer,
  options: optionReducer,
  quizId: resultReducer,
  itemVariables: itemVariableReducers,
  optionVariables: optionVariableReducers,
})

const reducer = combineReducers({
  editor: editorReducer,
})

const store = createStore(reducer, composeWithDevTools())

interface storeState {
  editor: {
    quizzes: { [quizId: string]: Quiz }
    items: { [itemId: string]: Item }
    options: { [optionId: string]: Option }
    quizId: string
    itemVariables: { [itemId: string]: ItemVariables }
    optionVariables: { [optionId: string]: OptionVariables }
  }
}

export const useTypedSelector: TypedUseSelectorHook<storeState> = useSelector

export default store

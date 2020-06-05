import { createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import editReducer from "../store/edit/reducers"

const store = createStore(editReducer, composeWithDevTools())

export default store

import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import editReducer, { EditorState } from "./edit/editReducer"
import userReducer, { UserState } from "./user/userReducer"
import { useSelector, TypedUseSelectorHook } from "react-redux"

const reducer = combineReducers({ editor: editReducer, user: userReducer })

const store = createStore(reducer, composeWithDevTools())

interface storeState {
  editor: EditorState
  user: UserState
}

export const useTypedSelector: TypedUseSelectorHook<storeState> = useSelector

export default store

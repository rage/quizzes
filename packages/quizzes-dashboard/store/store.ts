import { createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import editReducer, { EditorState } from "../store/edit/reducers"
import { useSelector, TypedUseSelectorHook } from "react-redux"

const store = createStore(editReducer, composeWithDevTools())

export const useTypedSelector: TypedUseSelectorHook<EditorState> = useSelector

export default store

import { createStore } from "redux"
import rootReducer from "./rootReducer"

const createStoreInstance = () => {
  return createStore(rootReducer)
}

export default createStoreInstance
